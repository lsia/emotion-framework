var data = require("sdk/self").data;
// Import the page-mod API
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
  include: "*.facebook.com",
  contentScriptFile: [data.url("js/lib/external/jquery-2.1.4.min.js"), data.url("js/lib/bootstrap.min.js"), data.url("js/lib/klf.js"), data.url("js/messageStorage.js"), data.url("js/content.js")],
  contentScriptOptions: {
    loggerPath: data.url("html/chat-logger.html")
  },
  contentScriptWhen: "end"
});
// Construct a panel, loading its content from the "text-entry.html"
// file in the "data" directory, and loading the "get-text.js" script
// into it.
var text_entry = require("sdk/panel").Panel({
	width: 300,
	height: 600,
  	position: {
   		top: 0,
   		right: 0
  	},
  	contentURL: data.url("views/panel.view.html")
});

// Create a button
require("sdk/ui/button/action").ActionButton({
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "16": "./imgs/icon.png",
    "32": "./imgs/icon.png",
    "64": "./imgs/icon.png"
  },
  onClick: handleClick
});

// Show the panel when the user clicks the button.
function handleClick(state) {
  text_entry.show();
}

// When the panel is displayed it generated an event called
// "show": we will listen for that event and when it happens,
// send our own "show" event to the panel's script, so the
// script can prepare the panel for display.
text_entry.on("show", function() {
  text_entry.port.emit("show");
});

// Listen for messages called "text-entered" coming from
// the content script. The message payload is the text the user
// entered.
// In this implementation we'll just log the text to the console.
text_entry.port.on("text-entered", function (text) {
  console.log(text);
  text_entry.hide();
});

text_entry.port.on("not-in-facebook", function (text) {
  //alert("Facebook not detected");
  text_entry.hide();
});

text_entry.port.on("secret-word-inserted", function (text) {
  console.log(text);
  //text_entry.hide();
});

