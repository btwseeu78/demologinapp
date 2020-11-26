var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : '*****',
	user     : '*****',
	password : '*****',
	database : '******'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
    var password = request.body.password;
    console.log(request.body)
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home'); //change this to your page like this response.sendFile(path.join(__dirname + '/<yourpage>.html'));
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
			console.log(results)

		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/reg', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var email = request.body.email;
    console.log(request.body)
	if (username && password) {
		sql = `INSERT INTO accounts (username, password, email) VALUES (? , ? , ?);`
		let valuesf = [username, password, email]
		console.log(valuesf)
		connection.query(sql, valuesf , function(error, results, fields) {
			if (results.affectedRows > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/'); 
			} else {
				response.send('Invalid Data Entry!');
			}			
			response.end();
//			console.log(error)
		});
	} else {
		response.send('Please enter all the data!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, v3 ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);