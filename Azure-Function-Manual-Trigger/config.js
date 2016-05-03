var config = (function () {
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
            return ('Please set the following settings:' + errors.join(' '));
        }
        return null;
    },
    init = function () {
        if (global.settings === null) {
            var settingsCheck = check();
            if (settingsCheck === null) {
                global.settings = {
                    searchName: process.env.searchName,
                    searchKey: process.env.searchKey,
                    searchIndex: process.env.searchIndex,
                    wpSrvUrl: process.env.wpSrvUrl,
                    wpSrcEndpoint: process.env.wpSrcEndpoint,
                    sendgridKey: process.env.sendgridKey,
                    mailTo: process.env.mailTo,
                    mailFrom: process.env.mailFrom
                };
            } else {
                return settingsCheck;
            }
        }
        return null;
    },
    getSearchSrvUrl = function () {
        return 'https://' + global.settings.searchName + '.search.windows.net/indexes/' + global.settings.searchIndex + '/docs/index?api-version=2015-02-28';
    };
    
    return {
        init: init,
        getSearchSrvUrl: getSearchSrvUrl
    }
})();

module.exports = config;