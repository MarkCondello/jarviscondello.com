const http = require('http')

http.createServer(function(req, resp){
	resp.write("This node server takes requests..")
	resp.end()
}).listen(3000)

console.log('Node server started on port 3000...')


