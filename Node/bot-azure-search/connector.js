module.exports = function() {

    var restify = require('restify');
    global.builder = require('botbuilder');

    var connector = new builder.ChatConnector({
        // These are environment variables defined in the Web App
        appId: process.env.MICROSOFT_APP_ID ? process.env.MICROSOFT_APP_ID : "",
        appPassword: process.env.MICROSOFT_APP_PASSWORD ? process.env.MICROSOFT_APP_PASSWORD : "",
        // Search results may be large so set to gzip:
        gzipData: true 
    });

    global.bot = new builder.UniversalBot(connector);

    // Setup Restify Server
    var server = restify.createServer();
    server.listen(process.env.port || 3978, function () {
        console.log('%s listening to %s', server.name, server.url);
    });
    server.post('/api/messages', connector.listen());
}