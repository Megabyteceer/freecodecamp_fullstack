'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();



	app.route('/vote:poll')
	.get(function(req, res) {
	    res.sendFile(path + '/public/index.html');
	});


	app.route('/')
		.get(isLoggedIn, function (req, res) {
			req.session.currentPoll = false;
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});
		
	app.route('/favicon.ico')
		.get(function (req, res) {
			res.sendFile(path + '/public/img/favicon.ico');
		});
		
		
		

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	app.get('/auth/google',
	  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));
	
	app.get('/auth/google/callback', 
	  passport.authenticate('google', {
	  	failureRedirect: '/login' }),
	  function(req, res) {
	    res.redirect('/');
	  });
	  
	app.get('/auth/twitter',
	  passport.authenticate('twitter'));
	
	app.get('/auth/twitter/callback', 
	  passport.authenticate('twitter', { failureRedirect: '/login' }),
	  function(req, res) {
	    res.redirect('/');
	  });

	
	app.route('/api/poll/:id')
		.post(pollHandler.postAnswer)
		.get(pollHandler.getPoll)
		.delete(isLoggedIn, pollHandler.deletePoll)

	app.route('/api/poll')
		.get(isLoggedIn, pollHandler.getPolls)
		.post(isLoggedIn, pollHandler.postPoll)
	

};
