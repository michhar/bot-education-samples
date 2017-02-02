/*-----------------------------------------------------------------------------
This Bot demonstrates processing user intents with a LUIS model, the
LuisRecognizer and IntentDialog methods of building up matching logic to a user
intent or want.  Trigger action and matching a regex intent is also
demonstrated.

It's part of the bot-education labs.

Try this out with a test dialog ("hi", "find me a hotel near lax", "bye").
Does it work as expected?  Any changes needed?

Based on this guide and code:
https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/intelligence-LUIS#luis-bot-sample

-----------------------------------------------------------------------------*/

// Required packages
var builder = require('botbuilder');
var restify = require('restify');

//============================================================
// Setting up server, connector
//============================================================

// Connector options
var botConnectorOptions = {
    appId: process.env.MICROSOFT_APP_ID || "",
    appPassword: process.env.MICROSOFT_APP_PASSWORD || ""
};

// Handle Bot Framework messages with a restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   //When testing on a local machine, 3978 indicates the port to test on
   console.log('%s listening to %s', server.name, server.url); 
});

// Instatiate the chat connector to route messages and create chat bot
var connector = new builder.ChatConnector(botConnectorOptions);
server.post('/api/messages', connector.listen());

//============================================================
// Defining how bot carries on the conversation with the user
//============================================================

// LUIS model REST enpoint URL.  To get this string either build up as below with the
// app id and subscription key, use the 'process.env' Azure system variables in 
// Application Settings, or copy in from the luis.ai Publish settings model URL.
// Created at https://luis.ai based on this guide:
// 
const LuisModelUrl = process.env.LUIS_MODEL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/[app id goes here]?subscription-key=[key goes here]';

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);

// Create the bot
var bot = new builder.UniversalBot(connector);

// Pass in the LUIS model recognizer to build up intents to be matched
bot.dialog('/', new builder.IntentDialog({ recognizers: [recognizer] })

    // Match the 'SearchHotels' intent from the LUIS model
    .matches('SearchHotels',
        function (session) {
            session.send('I see you are searching for a hotel.  We are analyzing your message: \'%s\'', session.message.text);
})
    // Regex match for greeting
    .matches(/^hi/i, function (session, args) {
    session.send("Hi there %s/%s  You are on the %s channel.", session.userData.userId, session.dialogData.name, session.userData.channelId);
})
    // If no intent is found, default behavior
    .onDefault(builder.DialogAction.send("One more time, please?"))
);

//============================================================
// Set up some trigger actions
//============================================================

// Example of a triggered action - when user types something matched by
// the trigger, this dialog begins, clearing the stack and interrupting
// the current dialog (so be cognizant of this).
// What if we had put 'send' instead of 'endDialog' here - try this.
bot.dialog('/bye', function (session) {
    // end dialog with a cleared stack.  we may want to add an 'onInterrupted'
    // handler to this dialog to keep the state of the current
    // conversation by doing something with the dialog stack
    session.endDialog("Ok... See you later.");
}).triggerAction({matches: /^bye|Bye/i});

//============================================================
// Add-ons
//============================================================

// intents.onBegin(function (session, args, next) {
//     session.dialogData.name = args.name;
//     session.send("Hi %s...", args.name);
//     next();
// });


// Serve a static web page - for testing deployment (note: this is optional)
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));



// More samples here:  https://github.com/Microsoft/BotBuilder-Samples
// And of course here:  https://github.com/Microsoft/BotBuilder/tree/master/Node/examples
