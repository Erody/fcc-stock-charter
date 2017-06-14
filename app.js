const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helpers = require('./helpers');

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
	res.locals.flashes = req.flash();
	res.locals.user = req.user || null;
	res.locals.currentPath = req.path;
	next();
});

app.get('/', (req, res) => {
	res.render('stockChart', { title: 'Stock chart'});
});

io.on('connection', (socket) => {
	console.log('A user connected');
	socket.on('disconnect', () => console.log('A user disconnected'));
	socket.on('chat message', msg => io.emit('chat message', msg));
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

