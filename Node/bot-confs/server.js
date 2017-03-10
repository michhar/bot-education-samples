/*-----------------------------------------------------------------------------
This Bot is a conference bot with a route for a FAQ and a route for the 
conference schedule.

This is a POC currently for routing to either a LUIS or QnAMaker model.

Try this out with a test dialog ("hi", "bye", "faq", "sched"...).

Good to test this with the Bot Framework emulator 
(https://docs.botframework.com/en-us/tools/bot-framework-emulator/).

The LUIS app is included in this folder as a json file.  Import this as
an app in LUIS and publish as a model and it should be in a workable state.

The QnAMaker can be around any FAQ you have.  It's generic and mostly a stub
here.

-----------------------------------------------------------------------------*/

// Required packages to import
var builder = require('botbuilder');
var restify = require('restify');
var cognitiveservices = require("botbuilder-cognitiveservices");


//============================================================
// Setting up server and connector
//============================================================



// Set up the restify server and a way to listen to a channel for user messages
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   //When testing on a local machine, 3978 indicates the port to test on
   console.log('%s listening to %s', server.name, server.url); 
});

// Connector options
var botConnectorOptions = {
    appId: process.env.MICROSOFT_APP_ID || "",
    appPassword: process.env.MICROSOFT_APP_PASSWORD || ""
};

// Instatiate the chat connector and ready the REST API to send bot replies
var connector = new builder.ChatConnector(botConnectorOptions);
server.post('/api/messages', connector.listen());

// Create our bot and connect it to the BF connector
var bot = new builder.UniversalBot(connector, function(session) {
    session.send("Hi!  I'm the MLADS bot.  Type 'help' for some guidance or " + 
    "'faq' for FAQs or 'sched' for schedule queries.");
});

//============================================================
// Defining how bot carries on the conversation with the user
//============================================================

// QnA Maker Dialogs

var recognizer_qna = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: '[your knowledgebase id here]', 
	subscriptionKey: '[your subscription key here]'});

var BasicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({ 
	recognizers: [recognizer_qna],
	defaultMessage: "Welcome to the FAQ.  Ask me something factual.",
	qnaThreshold: 0.5});



var model_url = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/[your app id here]?subscription-key=[your subscription key here]&verbose=true';

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Bot.
var recognizer_luis = new builder.LuisRecognizer(model_url);
var LUISIntents = new builder.IntentDialog({ recognizers: [recognizer_luis] });

// bot.dialog('/schedule', intents);

// bot.dialog('/', function(session) {
//     session.send("Hi.  I'm the MLADS bot.  Type 'help' for some guidance or 'faq' for FAQs or 'sched' for schedule queries.");
// });


bot.dialog('/faq', BasicQnAMakerDialog).triggerAction({ matches: /^faq/i });
bot.dialog('/schedule', LUISIntents).triggerAction({ matches: /^sched/i });


// When a user expresses the intent to find out where a speaker is talking,
// this dialog (just confirming at this point) is spawned
LUISIntents.matches('wherespeaker', [ 
    function (session, args, next) {
        var intent = args.intent;
        var speaker = builder.EntityRecognizer.findEntity(args.entities, 'speaker');
        if (!speaker) {
            builder.Prompts.text(session, 
                "What is the first and last name of the speaker?");
        } else {
            next({ response: speaker.entity });
        }
    },
    function (session, results) {
        if (results.response) {
            session.send("Ok...it looks like you are trying to find the location of a talk by %s.", 
                results.response);
        } else {
            session.send("Ok");
        }
    }
]
).matches('wheretalk', [
    function(session, args, next) {
        var intent = args.intent;
        var talk_title = builder.EntityRecognizer.findEntity(args.entities, 'talk_title');
        if (!talk_title) {
            builder.Prompts.text(session, "What is the name of the talk?");
        } else {
            next({response: talk_title.entity});
        }
        },
    function (session, results) {
        if (results.response) {
            session.send("Ok...it looks like you are trying to find the location of a talk titled %s.", 
                results.response);
        } else {
            session.send("Ok");
        }
    }
    
    
]);

LUISIntents.onDefault(builder.DialogAction.send("Hi!  I can help you with the schedule.  Ask where a speaker or talk by title is and I'll look it up."));


// Install a custom recognizer to look for user saying 'help' or 'goodbye'.
bot.recognizer({
    recognize: function (context, done) {
        var intent = { score: 0.0 };
        if (context.message.text) {
            switch (context.message.text.toLowerCase()) {
                case 'food':
                    intent = { score: 1.0, intent: 'Food' };
                    break;
                case 'coffee':
                    intent = { score: 1.0, intent: 'Coffee' };
                    break;
            }
        }
        done(null, intent);
    }
});

// Add help dialog with a trigger action bound to the 'Hours' intent
bot.dialog('coffeeDialog',  [
    function (session) {
        builder.Prompts.confirm(session, "Are you looking for coffee?");
    },
    function (session, results) {
        console.log(results.response);
        if (results.response == true) {
            session.endDialog("Coffee rocks");
        } else {
            session.endDialog("We also have tea and juice.");
        }
    }
]
).triggerAction({ matches: 'Coffee' });


// Add help dialog with a trigger action bound to the 'Help' intent
bot.dialog('/help', function (session) {
    session.endDialog("Type 'faq' for the frequently asked questions or 'sched' for schedule-related queries.  When in those dialogs you may type help again and it will show the specific help for that query type.  Improving all the time.");
}
// a trigger for dialog added here for help
).triggerAction({ matches: /^help|^Help/i });


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
}).triggerAction({matches: /^bye|^Bye|^quit|^end/i});


//============================================================
// Add-ons
//============================================================

// Serve a static web page - for testing deployment (note: this is optional)
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));


// More samples here:  https://github.com/Microsoft/BotBuilder-Samples
// And of course here:  https://github.com/Microsoft/BotBuilder/tree/master/Node/examples



