const mongoose = require('mongoose');
const m = require('../responses/responses');
const accessLevels = require('../acl/acl');

const User = mongoose.model('User');
const War = mongoose.model('War');

const utils = require('../lib/utils');

async function checkAccessLevel(req, res, next) {
	if(!req.headers || !req.headers.user_uid) {
		return res.status(m.m102.status).json(m.m102.response);
	}
	const user_uid = req.headers.user_uid;
	let [err, user] = await utils.wait(User.findOne, User, { uid: user_uid });
	if(err || !user) {
		return res.status(m.m103.status).json(m.m103.response);
	}
	const isAccessible = checkAccess(req.url, req.method, user.role);
	if(!isAccessible) {
		return res.status(m.m101.status).json(m.m101.response);
	}
	next();
}

function checkAccess(url, method, role) {
	const roleAccess = accessLevels[role];
	if(!roleAccess) {
		return false;
	}
	const methodAccess = roleAccess[method];
	if(!methodAccess) {
		return false;
	}
	const urlAccess = methodAccess.indexOf(url);
	if(urlAccess === -1) {
		return false;
	}
	return true;
}

function checkAdminKey(req, res, next) {
	if(req.headers.admin_key !== config.admin_key) {
		return res.status(401).json({error: 'Unauthorized'})
	}
	next();
}

async function listWarPlaces(req, res, next) {
	let [err, wars] = await utils.wait(War.find, War);
	if(err) {
		return res.status(m.m105.status).json(m.m105.response);
	}
	res.status(200).json({result: wars});
}

async function countBattle(req, res, next) {
	let [err, count] = await utils.wait(War.count, War);
	if(err) {
		return res.status(m.m106.status).json(m.m106.response);
	}
	res.status(200).json({result: count});
}

async function createUser(req, res, next) {
	let body = req.body;
	let [err, user] = await utils.wait(User.create, User, body);
	if(err) {
		return res.status(m.m104.status).json(m.m104.response);
	}
	res.status(200).json(user);
}


function unauthorized (req, res) {
	res.status(401).json({'error': 'Invalid endpoint'});
}

module.exports = {
	checkAdminKey,
	listWarPlaces,
	unauthorized,
	countBattle,
	checkAccessLevel,
	createUser
}