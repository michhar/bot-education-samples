/*-----------------------------------------------------------------------------
This Bot demonstrates how to use a waterfall to prompt the user with a series
of questions.

This example also shows the user of session.userData to persist information
about a specific user. 

# RUN THE BOT:

    Run the bot from the command line using "node app.js" and then type 
    "hello" to wake the bot up.
    
-----------------------------------------------------------------------------*/

require('./connector.js')();
require('./search_functions.js')();
require('./dialogs/search.js')();

// Set up the root dialog (control should always return here)
bot.dialog('/', [
    function (session) {
        session.beginDialog('/search');
    }
]);




// Next dialogs are example child dialogs that can be routed to from the root
//   with a 'beginDialog' or 'replaceDialog' and root is returned to
//   with an 'endDialog', 'replaceDialog' or 'endDialogWithResult'


bot.dialog('/help', [
    function (session) {
        session.endDialog('Help stub');
    }
]);

bot.dialog('/choices', [
    function (session) {
        // Use a builtin Prompt mechanism to build some choices
        builder.Prompts.choice(session, "Welcome to the choice dialog.  \
            Please make a choice: ", 
            ['Choice 1', 'Choice 2']);
    },
    function (session, results) {
        // Make sure there was a response from the choice prompt, i.e., not null
        if (results.response) {

            var selection = results.response.entity;
            session.endDialog(selection);

            // Do something with selection... 
            //   e.g. switch (selection) { case "Choice 1": ...}

        }
        else {
            session.endDialog('No results response from choice prompt.');
        }
    }

]);
