module.exports = function() {    

    var AzureSearch = require('azure-search');

    global.searchClient = AzureSearch({
        url: process.env.SEARCH_URL,
        // e.g. url: 'https://[accountname].search.windows.net',
        key: process.env.SEARCH_KEY
    });

    global.performSearch = function(name, callback) {
        // INDEXER_NAME will be an environment variable in the Azure Web app
        searchClient.search(process.env.INDEXER_NAME, {search: name}, 
            function(err, results) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else if (results && results.length > 0) {                
                    callback(null, results);
                } else {
                    callback();
                }
        });
    }
}