var https = require('https');
var querystring = require('querystring');

exports.handler = async function(event) {
    if (!event.body)
        return { statusCode: 400, body: 'No post data found'};
    
    let request_body = querystring.stringify({
    	"grant_type": "authorization_code",
    	"client_id": "YOUR_CLIENT_ID",
    	"client_secret": "YOUR_CLIENT_SECRET",
    	"code": event.body,
    	"redirect_uri": "https://flassari.github.io/recipe-helper",
    });
    
    let options = {
        host: "login.microsoftonline.com",
        port: 443,
        path: "/common/oauth2/v2.0/token",
        method: "POST",
        headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Content-Length': request_body.length,
       }
    };

    const promise = new Promise(function(resolve, reject) {
        var request = https.request(options, function(results) {
            let data = '';
            results.setEncoding('utf8');
            results.on('data', function(chunk) {
                data += chunk;
            });
            results.on('end', function() {
                console.log(data);
                resolve({
                    statusCode: 200,
                    body: data,
                    headers: {
                        // REPLACE THIS WITH YOUR OWN DOMAIN
                        "Access-Control-Allow-Origin": "https://flassari.github.io",
                        "Content-Type": "application/json"
                    },
                });
            });
        });
    
        request.on('error', (e) => {
            reject(Error(e));
        });
        request.write(request_body);
        console.log(request_body);
        request.end();
    });
    
    return promise;
};
