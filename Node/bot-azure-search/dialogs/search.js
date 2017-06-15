module.exports = function () {
    bot.dialog('/search', [
        function (session) {
            session.sendTyping();
            builder.Prompts.text(session, "I'm a chatbot with a specific task in mind.  \
                I can answer questions around <task>.  Type your query here \
                (if I don't know please call <number> to reach a human):");
        },
        function (session, results) {
            var name = results.response;
            if (name != null) {
                // Perform search (custom bot function)
                performSearch(name, function (err, results) {
                    if (err) {
                        session.endDialog('Error ', err.response);
                    }
                    if (results) {

                        // Save the results and type of query in session data - for another dialog perhaps
                        session.privateConversationData.queryResults = results;
                        session.privateConversationData.searchType = "freeform";

                        console.log(results);

                        // Do something with results like looking at results[i]['@search.score']
                        session.endDialog('Done.  Nice talking to you.');

                    } else {
                        // No sufficiently good results to reset query and restart
                        session.send("I couldn't find a result at the moment.");
                        // Return to root dialog
                        session.endDialog("See you next time.");
                    }
                });
            } else {
                session.send("Oops.  I slipped up finding what you need.");
            }
        }
    ]);
}