const http = require('http'); 

const hostname = '127.0.0.1'; 
const port = 2800;

const server = http.createServer((req, res) => { 
	res.statusCode = 200; 
	res.setHeader('Content-Type', 'text/plain'); 
	res.end('Hello World\n'); 
	console.log(req.headers);
	console.log(res.getHeaders());
	console.log(' ');
	console.log(req.rawHeaders);
}); 

server.listen(port, hostname, () => { 
   console.log(`Server running at http://${hostname}:${port}/`); 
}); 
