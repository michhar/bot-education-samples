//=========================================================
// Bot for demonstrating Cognitive Services API calls
//   - menu dialogs based on:  https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/basics-menus/app.js
//=========================================================

var restify = require('restify');
var builder = require('botbuilder');
var config = require('./configuration');

//=========================================================
// Bot Setup
//=========================================================

/******** FOR USE WITH BOT EMULATOR AND/OR FOR DEPLOYMENT *********
*/

// Get secrets from server environment or settings in local file
var botConnectorOptions = { 
    appId: config.CONFIGURATIONS.CHAT_CONNECTOR.APP_ID, 
    appPassword: config.CONFIGURATIONS.CHAT_CONNECTOR.APP_PASSWORD
};

// Create bot
var connector = new builder.ChatConnector(botConnectorOptions);


// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
server.post('/api/messages', connector.listen());

// Serve a static web page - for testing deployment
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

// Listen on a standard port (this will be the port for local emulator and cloud)
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});

/*
****************************************************************/

//=========================================================
// Bots Dialogs
//=========================================================

var bot = new builder.UniversalBot(connector, function (session) {
        session.send("Hello... I'm a testing bot.");
        session.beginDialog('go');
});

// bot.dialog('/',
//     function (session) {
//         session.send("Hello... I'm a testing bot.  Say anything to begin.");
//     }
// );

bot.dialog('go', [
    function(session) {
        builder.Prompts.text(session, "Paste a url link to an image here.");
    },
    function(session, results) {
        callCogService(results.response, function(error, response, body) {
            console.log(body);
            session.send(body);
            session.endDialogWithResult(results);
        })
    }
]);

//=========================================================
// Cognitive Services API call
//=========================================================

var request = require("request");

var callCogService = function _callCogService(content, callback) {

    // This example is for the Vision API OCR
    var options = {
        method: 'POST',
        url: config.CONFIGURATIONS.COMPUTER_VISION_SERVICE.API_URL + "ocr/",
        headers: {
            'ocp-apim-subscription-key': config.CONFIGURATIONS.COMPUTER_VISION_SERVICE.API_KEY,
            'content-type': 'application/json'
        },
        body: {url: content},
        json: true
    };

    request(options, callback);

};


// sample image url:  https://img0.etsystatic.com/045/0/6267543/il_570xN.665155536_842h.jpg
