/*-----------------------------------------------------------------------------
This Bot demonstrates how to use an EntityRecognizer and LuisRecognizer along
with a Cortana pre-built LUIS application to add quick functionality and
natural language support to a bot. The example also shows how to use 
UniversalBot.send() to push notifications to a user.

It's part of the bot-education labs.

Based loosely on this bot(s):  
- https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/basics-naturalLanguage/app.js

Worth looking at the custom intent recognizer option as well:
- https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/feature-customRecognizer/app.js

For a complete walkthrough of creating an alarm bot see the article below (an alternative setup with LUIS)
Notice the many changes from this documentation.  Still a valid approach, however.
    http://docs.botframework.com/builder/node/guides/understanding-natural-language/

List of pre-built cortana entities from LUIS: https://www.luis.ai/Help#PreBuiltApp

Try this out with a test dialog ("hello", "set appointment", "test name", "hello again"...).
Does it work as expected?  Any changes needed?

-----------------------------------------------------------------------------*/

// Required packages
var builder = require('botbuilder');
var restify = require('restify');

/***************************** SETUP  ************************* */

// Connector options
var botConnectorOptions = {
    appId: process.env.MICROSOFT_APP_ID || "",
    appPassword: process.env.MICROSOFT_APP_PASSWORD || ""
};

// Instatiate the chat connector to route messages
var connector = new builder.ChatConnector(botConnectorOptions);

// Handle Bot Framework messages with a restify server
var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.port || process.env.PORT || 3978, function () { 
    console.log('%s listening to %s', server.name, server.url); 
});

//********************* EXAMPLE ************************* */

// The model_url of format:  
//   https://api.projectoxford.ai/luis/v2.0/apps/[model id goes here]?subscription-key=[key goes here]
//  Replace the "" with your model url
var model_url = "" || "https://api.projectoxford.ai/luis/v2.0/apps/[model id goes here]?subscription-key=[key goes here]";

// Setup bot and default message handler
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hi... I'm the appointment bot sample. I can recognize calendar entries.");
});

// // The following lines (commented here) are now placed into one line
// var recognizer = new builder.LuisRecognizer('<your models url>');
// var intents = new builder.IntentDialog({ recognizers: [recognizer] });
// bot.dialog('/', intents);

// Now in one line:
bot.recognizer(new builder.LuisRecognizer(model_url));

// Add help dialog with a trigger action bound to the 'Help' intent
bot.dialog('setAppt', [
    function (session, args, next) {
        var intent = args.intent;
        var title = builder.EntityRecognizer.findEntity(intent.entities, 'builtin.intent.calendar.title');
        if (!title) {
            builder.Prompts.text(session, "What would you like to call the appointment?");
        } else {
            next({ response: title });
        }
    },
    function (session, results) {
        if (results.response) {
            session.send("Ok... Added the '%s' appointment.", results.response);
        } else {
            session.send("Ok");
        }
    }
] // a trigger for dialog added here for a "named" intent based on pre-built naming options
).triggerAction({ matches: 'builtin.intent.calendar.create_calendar_entry' });

// Add global endConversation() action bound to the 'Goodbye' intent - does this get called?  why or why not?
//  if not, how would you add this?
bot.endConversationAction('goodbyeAction', "Ok... See you later.", { matches: 'Goodbye' });

/************************* ADVANCED EXERCISE *************************/

// Add options to enter date and time.

/************************* OPTIONAL PARTS *************************/

// Serve a static web page - for testing deployment
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));



// More samples here:  https://github.com/Microsoft/BotBuilder-Samples
// And of course here:  https://github.com/Microsoft/BotBuilder/tree/master/Node/examples
