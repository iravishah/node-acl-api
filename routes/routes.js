module.exports = () => {
	const express = require('express');
	const router = express.Router();
	const middleware = require('../middleware/middleware');

	router.post('/user', 
		middleware.checkAdminKey,
		middleware.checkAccessLevel,
		middleware.createUser
	);
	
	router.get('/list',
		middleware.checkAdminKey,
		middleware.checkAccessLevel,
		middleware.listWarPlaces
	);

	router.get('/count',
		middleware.checkAdminKey,
		middleware.checkAccessLevel,
		middleware.countBattle
	);

	router.all('*',
		middleware.unauthorized
	);
	return router;
}