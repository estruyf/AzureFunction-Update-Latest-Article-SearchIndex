var logging = (function () {
    var error = function (context, message) {
        context.res = {
            status: 400,
            body: message
        };
        context.done();
    };
    
    return {
        error: error
    }
})();

module.exports = logging;