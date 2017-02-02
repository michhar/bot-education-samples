/*-----------------------------------------------------------------------------
This Bot demonstrates how to register a custom Intent Recognizer that will be
run for every message recieved from the user. Custom recognizers can return a 
named intent that can be used to trigger actions and dialogs within the bot.
This specific example adds a recognizer that looks for the user to say 'hours'
or 'goodbye' but you could easily add a recognizer that looks for the user to 
send an image or calls some external web service to determine the users intent.

# RUN THE BOT:
    Run the bot from the command line using "node server-hours.js" and then type 
    "hello" to wake the bot up.
    
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

// Setup bot and default message handler
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: '%s'. Try asking for 'hours' or say 'goodbye' to quit", session.message.text);
});

// Install a custom recognizer to look for user saying 'help' or 'goodbye'.
bot.recognizer({
    recognize: function (context, done) {
        var intent = { score: 0.0 };
        if (context.message.text) {
            switch (context.message.text.toLowerCase()) {
                case 'hours':
                    intent = { score: 1.0, intent: 'Hours' };
                    break;
                case 'goodbye':
                    intent = { score: 1.0, intent: 'Goodbye' };
                    break;
            }
        }
        done(null, intent);
    }
});

// Add help dialog with a trigger action bound to the 'Help' intent
bot.dialog('helpDialog', function (session) {
    session.endDialog("This bot will echo back anything you say. Say 'goodbye' to quit.");
}).triggerAction({ matches: 'Help' });

// Add help dialog with a trigger action bound to the 'Hours' intent
bot.dialog('hoursDialog',  [
    function (session) {
        builder.Prompts.text(session, "What is the name of the place?");
    },
    function (session, results) {
        session.userData.place = results.response;
        builder.Prompts.time(session, "What date are you interested in?");
    },
    function(session, results) {
        var time = time = builder.EntityRecognizer.resolveTime([results.response]);

        var day = time.getDate();
        var month = time.getMonth() + 1;
        var year = time.getFullYear();

        session.userData.date = 'day:' + day + ' month:' + month + ' year:' + year;
        session.endDialog("You've asked for the hours of %s on %s", session.userData.place,
            session.userData.date );
    }
]
).triggerAction({ matches: 'Hours' });

// Add global endConversation() action bound to the 'Goodbye' intent
bot.endConversationAction('goodbyeAction', "Ok... See you later.", { matches: 'Goodbye' });

// // Note:  These are time vars
// var date = new Date();
// var day = date.getDate();
// var monthIndex = date.getMonth();
// var year = date.getFullYear();