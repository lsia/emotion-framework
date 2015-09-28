window.messageStorage = (function() {
    // Public object. Observable, exposes 'on' method
    var messageStorage = {
        add: add,
        getAll: getAll
    };

    // Private stuff
    var DB_NAME = 'lsia',
        DB_VERSION = 1,
        OBJECT_STORE_NAME = 'messages',
        dbConnection = indexedDB.open(DB_NAME, DB_VERSION),
        db;

    dbConnection.onblocked = function (event) {
        console.error('IndexedDB blocked event', event);
    };
    dbConnection.onerror = function (event) {
        console.error('IndexedDB error event', event);
    };
    dbConnection.onupgradeneeded = function (event) {
        console.log('IndexedDB upgrading db %s to version %d', DB_NAME, DB_VERSION);
        db = dbConnection.result;

        if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
            var objectStore = db.createObjectStore(OBJECT_STORE_NAME, { autoIncrement: true });
            // Add indices here, and increment DB_VERSION if you create new ones
            objectStore.createIndex("conversationId", "conversationId", {unique: false});
        }
    };
    dbConnection.onsuccess = function (event) {
        console.log('IndexedDB connection opened successfully');
        db = dbConnection.result;

        // If some message were added before the connection was ready, they're waiting in tempStore array
        tempStore.forEach(add);
        tempStore = [];
    };

    var tempStore = [];
    function add(message) {
        if (!db) {
            console.warn("Storage not ready yet.");
            return tempStore.push(message);
        }

        var transaction = db.transaction([OBJECT_STORE_NAME], "readwrite"),
            store = transaction.objectStore(OBJECT_STORE_NAME),
            addRequest = store.add(message);

        addRequest.onerror = function (event) {
            console.error("Error while adding message", message, event);
        };

        addRequest.onsuccess = function (event) {
            observableStorage.trigger('newMessage', message);
        };
    }

    function getAll(onSuccess) {
        if (!db) {
            console.warn("Storage not ready yet.");
            return onSuccess(tempStore);
        }

        var transaction = db.transaction([OBJECT_STORE_NAME], "readonly"),
            store = transaction.objectStore(OBJECT_STORE_NAME),
            // Method in spec, not available yet https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAll
            //getRequest = store.getAll();
            getRequest = store.openCursor(),
            messages = [];

        getRequest.onerror = function (event) {
            console.error("Error while getting messages", event);
        };

        getRequest.onsuccess = function (event) {
            var cursor = getRequest.result;

            if (cursor) {
                messages.push(cursor.value);
                cursor.continue();
            } else {
                onSuccess(messages);
            }
        };
    }


    var observableStorage = $(messageStorage);
    messageStorage.on = observableStorage.on.bind(observableStorage);


    return messageStorage;

})();



/**
 * Usage
 *
messageStorage.on('newMessage', function (event, message) {
    console.log('Message saved event!', message);
});

messageStorage.add({conversationId: 'some_conv_id', from: 'some_fb_id', to: 'some_other_fb_id', text: 'hey'});

// timeout so it can open the db connection
setTimeout( function () {
    messageStorage.getAll(function (messages) {
        console.log(messages);
    });
}, 2000);
//*/

