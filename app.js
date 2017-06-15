require('dotenv').config({ path: 'variables.env'});
const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const request = require('request-promise-native');
const helpers = require('./helpers');
const routes = require('./routes/index');
const apiRoutes = require('./routes/api');

const PORT = process.env.PORT || 3000;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
	// socket.on('stockChange', stocks => io.emit('stockChange', stocks));
	socket.on('newStock', data => {
		// todo REMOVE THE :3000 WHEN MOVING TO PRODUCTION
		request(`${data.baseUrl}:3000/api/getStock?stockName=${data.stock}`)
			.then(res => JSON.parse(res))
			.then(data => helpers.transformForHighchart(data))
			.then(transformed => socket.emit('stockChange', {stockName: data.stock, data: transformed}))
			.catch(err => console.error(err))
	});
});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// todo Adding stock
	// user submits stock name via form
	// value of text input is emitted via socket.io as 'newStock'
	// check if stock exists
	// on success
		// stock gets added to database
		// emit 'stockChange' with the new stocks
		// re-render graph with new stocks on 'stockChange'
	// on failure
		// don't do anything

