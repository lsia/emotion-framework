Archivos de muestra para probar solamente el plugin en firefox.
Se utiliza para desarrollar la herramiento jpm del sdk de mozilla (https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm)

Enrique

### Message Storage

This local storage based on IndexedDb is intended to act as a temporal storage until messages are synchronized with the server.


#### API

##### add
Stores message in the database.

`add(message)`

```javascript
messageStorage.add({conversationId: convid,
                     userId: userid,
                     timeStamp: Date.now(),
                     text: msg });
```

##### newMessage
Callback for the event of a newMessage being added.

`on("newMessage", do)`

```javascript
messageStorage.on('newMessage', function (event, message) {
		    console.log('Message saved event!', message);
		});
```

##### get
Retrieval of stored messages based on a given index and filters. Can be used for single queries or to retrieve messages in a given range. Further information on how indexed searches work, check the IndexedDb documentation.

`get(query, onsuccess)`

```javascript
// Get all from this userId
messageStorage.get({from: 'userId', select: selectedUserName}, function (messages) {
			        console.log(messages);
			        $("#result").text(JSON.stringify(messages));
			    });

// Get all in Range
messageStorage.get({from: indexName, low: lowerBound, up: upperBound},
                    function (messages) {
          		        console.log(messages);
          		        $("#result").text(JSON.stringify(messages));
          		    });
```

##### getAll
Retrieve all the messages currently stored in the database.

`getAll(onSuccess)`

```javascript
messageStorage.getAll(function (messages) {
		        console.log(messages);
		        $("#result").text(JSON.stringify(messages));
		    });
```

##### clear
Remove all the messages from the database.

`clear (onsuccess)`

```javascript
messageStorage.clear(function () {
		        $("#result").empty();
		    });
```