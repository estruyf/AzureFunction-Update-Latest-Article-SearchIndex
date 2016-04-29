var configuration = require('./config'),
    config = configuration.get();
    request = require('request'),
    mail = require('./mail'),
    striptags = require('striptags');
    
module.exports = function (context, req) {
    // Retrieve the latest blog article
    request(config.wpSrvUrl + config.wpSrcEndpoint, (error, response, data) => {
        if (!error && response.statusCode == 200) {
            if (data !== null) {
                context.log('Blog article retrieved');
                var result = JSON.parse(data);
                if (typeof result.posts === 'undefined') {
                    throw('There was something wrong with retrieving the latest blog article.');
                }
                // Get the article object
                var article = result.posts[0];
                // Strip the article content from HTML tags
                var strippedContent = striptags(article.content).replace(/\n/g, ' ');
                // Create a tags collection
                var tags = [];
                for (var key in article.tags) {
                    tags.push(key);
                }
                
                // Article body
                var articleBody = {
                    "value": [
                        {
                            '@search.action': 'mergeOrUpload',
                            postId: article.ID.toString(),
                            title: article.title,
                            author: article.author.name,
                            url: article.URL,
                            content: strippedContent,
                            date: new Date(article.date),
                            excerpt: article.excerpt,
                            slug: article.slug,
                            tags: tags,
                            updated: new Date() // This field is used to know when it was last indexed
                        }
                    ]
                };
                
                // Add the article to the Azure Index
                var searchSrvUrl = configuration.getSearchSrvUrl();
                var postOptions = {
                    url: searchSrvUrl, 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': config.searchKey
                    },
                    body: JSON.stringify(articleBody)
                };
                
                request(postOptions, (error, response, data) => {
                    if (!error && response.statusCode == 200) {
                        context.log('Article index response -> OK');                        
                        if (data !== null) {
                            var result = JSON.parse(data);
                            if (typeof result.value !== 'undefined') {
                                if (result.value.length > 0) {
                                    if (result.value[0].status) {
                                        context.log('Article index status -> OK');
                                        mail.send('Azure search index updated!', 'The Azure search index got updated from an Azure function.');
                                    } else {
                                        context.log('Article index status -> NOK');
                                        mail.send('Azure search index updated failed!', 'There was a problem adding your latest article to the index.');
                                    }
                                    context.done();
                                }
                            }
                        } else {
                            context.log('Article failed to add to the index!');
                            mail.send('Azure search error!', 'Article failed to add to the index!');
                            context.done();
                        }
                    } else {
                        context.log('Article failed to add to the index!');
                        mail.send('Azure search error!', 'Article failed to add to the index!');
                        context.done();
                    }
                });
            }
        } else {
            // Log the error
            context.log('Failed to retrieve article!');
            mail.send('Azure search error!', 'Failed to retrieve article from Wordpress!');
            context.done();
        }
    });
};