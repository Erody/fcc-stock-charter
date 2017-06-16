require('dotenv').config({ path: 'variables.env'});
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const request = require('request-promise-native');
require('./models/Stock');
const Stock = mongoose.model('Stock');
const helpers = require('./helpers');
const routes = require('./routes/index');
const apiRoutes = require('./routes/api');

const PORT = process.env.PORT || 3000;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
	console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

// expose static files
app.use(express.static('public'));

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
	secret: process.env.SECRET || 'test',
	key: process.env.KEY || 'testing',
	resave: false,
	saveUninitialized: false,
	//store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
	res.locals.h = helpers;
	res.locals.io = io;
	res.locals.flashes = req.flash();
	res.locals.user = req.user || null;
	res.locals.currentPath = req.path;
	next();
});

app.use('/', routes);
app.use('/api', apiRoutes);

io.on('connection', (socket) => {
	console.log('A user connected');
	socket.on('disconnect', () => console.log('A user disconnected'));
	socket.on('newStock', data => {
		// todo REMOVE THE :3000 WHEN MOVING TO PRODUCTION
		request(`${data.baseUrl}:3000/api/getStock?stockName=${data.stock}`)
			.then(res => JSON.parse(res))
			.then(data => helpers.transformForHighchart(data))
			.then(async transformed => {
				const oldStocks = await Stock.find();
				const newStock = new Stock({
					name: data.stock.toUpperCase(),
					data: transformed
				});
				try {
					await newStock.save();
					io.emit('stockChange', [...oldStocks, newStock])
				} catch(e) {
					// if stock already exists
					// just prevent the error message.
				}
			})
			.catch(err => console.error(err))
	});
	socket.on('removeStock', data => {
		// todo REMOVE THE :3000 WHEN MOVING TO PRODUCTION
		request(`${data.baseUrl}:3000/api/removeStock/${data.stock}`)
			.then(res => JSON.parse(res))
			.then(async res => {
				if (res.status === 'success') {
					const stocks = await Stock.find();
					io.emit('stockChange', stocks);
				}
			})
	})
});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// todo Make it prettier
