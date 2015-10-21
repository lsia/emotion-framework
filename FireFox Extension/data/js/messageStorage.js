console.log("PRE MSTORE");

window.messageStorage = (function() {
    console.log("INIT MSTORE");

    // Public object. Observable, exposes 'on' method
    var messageStorage = {
        add: add,
        getAll: getAll,
        get: get,
        clear: clear
    };

    // Private Constants
    var LSIA_DB = 'lsia',
        DB_VERSION = 2,
        MESSAGES_OBJECT_STORE = 'messages',
        USER_ID = 'userId',
        MSG_TIMESTAMP = 'timeStamp'
        CONVERSATION_ID = 'conversationId',
        USER_CONVERSATION_INDX = 'userId, conversationId',
        USER_MSG_TIMESTAMP_INDX = 'userId, timeStamp';

    // DB initialization
    var dbConnection = indexedDB.open(LSIA_DB, DB_VERSION),
        db;

    dbConnection.onblocked = function (event) {
        console.error('IndexedDB blocked event', event);
    };
    dbConnection.onerror = function (event) {
        console.error('IndexedDB error event', event);
    };

    dbConnection.onupgradeneeded = function (event) {
        console.log('IndexedDB upgrading db %s to version %d', LSIA_DB, DB_VERSION);
        db = dbConnection.result;

        if (!db.objectStoreNames.contains(MESSAGES_OBJECT_STORE)) {
            var objectStore = db.createObjectStore(MESSAGES_OBJECT_STORE, { autoIncrement: true });

            // Simple Indices
            objectStore.createIndex(USER_ID, USER_ID, {unique: false});
            objectStore.createIndex(MSG_TIMESTAMP, MSG_TIMESTAMP, {unique: false});
            objectStore.createIndex(CONVERSATION_ID, CONVERSATION_ID, {unique: false});
            // Compound Indeces
            objectStore.createIndex(USER_CONVERSATION_INDX, [USER_ID, CONVERSATION_ID], {unique: false});
            objectStore.createIndex(USER_MSG_TIMESTAMP_INDX, [USER_ID, MSG_TIMESTAMP], {unique: false});
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

        var transaction = db.transaction([MESSAGES_OBJECT_STORE], "readwrite"),
            store = transaction.objectStore(MESSAGES_OBJECT_STORE),
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

        var transaction = db.transaction([MESSAGES_OBJECT_STORE], "readonly"),
            store = transaction.objectStore(MESSAGES_OBJECT_STORE),
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

    function get(query, onsuccess) {
        var keyRange = query.select === undefined ?
                         IDBKeyRange.bound(query.low, query.up) : IDBKeyRange.bound(query.select, query.select);

        var objectStore = db.transaction([MESSAGES_OBJECT_STORE], "readonly").objectStore(MESSAGES_OBJECT_STORE),
            getRequest = objectStore.index(query.from).openCursor(keyRange),
            data = [];

        getRequest.onerror = function (event) {
            console.error("Error while getting messages", event);
        };

        getRequest.onsuccess = function (event) {
          var cursor = event.target.result;
          if(cursor) {
            console.log(cursor.key);
            data.push({ key: cursor.key, value: cursor.value });  
              
            cursor.continue();
          } else {
            console.log('All displayed ' + data.length);
            onsuccess(data);    
          } 
        };
    }

    function clear (onsuccess) {
        var store = db.transaction([MESSAGES_OBJECT_STORE], "readwrite").objectStore(MESSAGES_OBJECT_STORE);
        // clear all the data out of the object store
        var objectStoreRequest = store.clear();

        objectStoreRequest.onsuccess = function(event) {
            console.log('All data removed from ' + MESSAGES_OBJECT_STORE);
            if (typeof(onsuccess) === typeof(Function)) onsuccess();
        };

        objectStoreRequest.onerror = function (event) {
            console.error("Error while getting messages", event);
        };
    }

    var observableStorage = $(messageStorage);
    messageStorage.on = observableStorage.on.bind(observableStorage);


    console.log("RETURNED MSTORE");
    return messageStorage;

})();


/**
 * Usage
 *
messageStorage.on('newMessage', function (event, message) {
    console.log('Message saved event!', message);
});

messageStorage.add({conversationId: 'some_conv_id', userId: 'some_fb_id',
                     to: 'some_other_fb_id', timeStamp: 123123123,
                     text: 'hey'});

// timeout so it can open the db connection
setTimeout( function () {
    messageStorage.getAll(function (messages) {
        console.log(messages);
    });
}, 2000);
//
messageStorage.get({from: "userId", select: "juan1111"}, function (messages) {
        console.log(messages);
    });

messageStorage.get({
        from: "conversationByUserId", select: ["juan1111", "conversation001"]
    },function (messages) {
        console.log(messages);
    });
*/

