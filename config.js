var config = (function () {
    var settings;
    
    var check = function () {
        if (!process.env.searchName) {
            throw('Please set the searchName setting');
        }
        
        if (!process.env.searchKey) {
            throw('Please set the searchKey setting');
        }
        
        if (!process.env.searchIndex) {
            throw('Please set the searchIndex setting');
        }
        
        if (!process.env.wpSrvUrl) {
            throw('Please set the wpSrvUrl setting');
        }
        
        if (!process.env.wpSrcEndpoint) {
            throw('Please set the wpSrcEndpoint setting');
        }
        
        if (!process.env.sendgridKey) {
            throw('Please set the sendgridKey setting');
        }
        
        if (!process.env.mailTo) {
            throw('Please set the mailTo setting');
        }
        
        if (!process.env.mailFrom) {
            throw('Please set the mailFrom setting');
        }
        
        return true;
    },
    get = function () {
        if (check()) {
            settings = {
                searchName: process.env.searchName,
                searchKey: process.env.searchKey,
                searchIndex: process.env.searchIndex,
                wpSrvUrl: process.env.wpSrvUrl,
                wpSrcEndpoint: process.env.wpSrcEndpoint,
                sendgridKey: process.env.sendgridKey,
                mailTo: process.env.mailTo,
                mailFrom: process.env.mailFrom
            };
            return settings;
        }
    },
    getSearchSrvUrl = function () {
        return 'https://' + settings.searchName + '.search.windows.net/indexes/' + settings.searchIndex + '/docs/index?api-version=2015-02-28';
    };
    
    return {
        get: get,
        getSearchSrvUrl: getSearchSrvUrl
    }
})();

module.exports = config;