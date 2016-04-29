var config = (function () {
    var settings;
    
    var check = function () {
        var errors = [];
        if (!process.env.searchName) {
            errors.push('searchName');
        }
        
        if (!process.env.searchKey) {
            errors.push('searchKey');
        }
        
        if (!process.env.searchIndex) {
            errors.push('searchIndex');
        }
        
        if (!process.env.wpSrvUrl) {
            errors.push('wpSrvUrl');
        }
        
        if (!process.env.wpSrcEndpoint) {
            errors.push('wpSrcEndpoint');
        }
        
        if (!process.env.sendgridKey) {
            errors.push('sendgridKey');
        }
        
        if (!process.env.mailTo) {
            errors.push('mailTo');
        }
        
        if (!process.env.mailFrom) {
            errors.push('mailFrom');
        }
        
        if (errors.length) {
            throw('Please set the following settings: ' + errors.join(' '));
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