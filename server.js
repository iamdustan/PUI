/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(process.env.C9_PORT, "0.0.0.0");
console.log('Server running at: http://pui.iamdustan.cloud9ide.com');
*/

/*
var sys = require("sys"),  
    http = require("http"),  
    url = require("url"),  
    path = require("path"),  
    fs = require("fs");  
  
http.createServer(function(request, response) {  
    var uri = url.parse(request.url).pathname;  
    var filename = path.join(process.cwd(), uri);  
    path.exists(filename, function(exists) {  
        if(!exists) {  
            response.sendHeader(404, {"Content-Type": "text/plain"});  
            response.write("404 Not Found\n");  
            response.close();  
            return;  
        }  
  
        fs.readFile(filename, "binary", function(err, file) {  
            if(err) {  
                response.sendHeader(500, {"Content-Type": "text/plain"});  
                response.write(err + "\n");  
                response.close();  
                return;  
            }  
  
            response.sendHeader(200);  
            response.write(file, "binary");  
            response.close();  
        });  
    });  
}).listen(process.env.C9_PORT, "0.0.0.0");  
sys.puts("Server running at " + process.env.C9_PORT);  
*/

var sys = require('sys')
  , http = require('http')
  , fs = require('fs')
  , index;
 
fs.readFile('./dialog.html', function (err, data) {
    if (err) {
        throw err;
    }
    index = data;
});
 
http.createServer(function(request, response) {
    console.log(process);
}).listen(process.env.C9_PORT, "0.0.0.0");