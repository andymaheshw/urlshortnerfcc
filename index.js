require('babel-register');

const app = require('./src/app').app, 
     PORT = process.env.PORT || 3030;

app.listen(PORT, function () {
	console.log('url shortener microservice running on port', PORT);
})