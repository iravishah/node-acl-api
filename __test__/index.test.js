const chai = require('chai');
const should = require('should');
const index = require('../index');
const request = require('request');
const baseUrl = 'http://localhost:8889'

const mockJson = require('./lib/mockJson');

const User = mongoose.model('User');

describe('Middleware Unit Test', () => {
	describe('Admin user test suit', () => {
		let adminUserId = null;
		before(() => {
			return User.create(mockJson.adminUser)
				.then((user) => {
					adminUserId = user.uid;
					return true;
				})
		})
		after(() => {
			User.remove({ uid: adminUserId}).exec();
		})
		describe('success scenarios', () => {
			it('should return location of all battle places', (done) => {
				let options = {
					'method': 'GET',
					'url': `${baseUrl}/list`,
					'headers': {
						'admin_key': config.admin_key,
						'user_uid': adminUserId
					}
				}
				request(options, (err, res, data) => {
					should.not.exists(err);
					should.exists(data);
					data = JSON.parse(data);
					data.should.have.properties(['result'])
					done()
				})
			})
			it('should return count of all battles', (done) => {
				let options = {
					'method': 'GET',
					'url': `${baseUrl}/count`,
					'headers': {
						'admin_key': config.admin_key,
						'user_uid': adminUserId
					}
				}
				request(options, (err, res, data) => {
					should.not.exists(err);
					should.exists(data);
					data = JSON.parse(data);
					data.should.have.properties(['result'])
					done()
				})
			})
		});
		describe('faliure scenarios', () => {
			it('should return unauthorized', (done) => {
				let options = {
					'method': 'GET',
					'url': `${baseUrl}/list`,
					'headers': {
						'admin_key': 'dummy'
					}
				}
				request(options, (err, res, data) => {
					should.not.exists(err);
					should.exists(data);
					data = JSON.parse(data);
					data.should.have.properties(['error'])
					done()
				})
			})
		});
	});
	describe('Super Admin user test suit', () => {
		let superAdminUserId = null,
			adminUserId = null
		before(() => {
			return User.create(mockJson.superAdminUser)
				.then((user) => {
					superAdminUserId = user.uid;
					return true;
				})
		})
		after(() => {
			User.remove({ uid: superAdminUserId}).exec();
			User.remove({ uid: adminUserId}).exec();
		})
		describe('success scenarios', () => {
			it('should create dummy admin user', (done) => {
				let options = {
					'method': 'POST',
					'url': `${baseUrl}/user`,
					'headers': {
						'admin_key': config.admin_key,
						'user_uid': superAdminUserId
					},
					'json': {
						'name': 'dummy-user',
						'role': 'admin'
					}
				}
				request(options, (err, res, data) => {
					adminUserId = data.uid;
					should.not.exists(err);
					should.exists(data);
					done()
				})
			})
		});
		describe('faliure scenarios', () => {
			it('should return do not have permission to access the resource', (done) => {
				let options = {
					'method': 'GET',
					'url': `${baseUrl}/list`,
					'headers': {
						'admin_key': config.admin_key,
						'user_uid': superAdminUserId
					}
				}
				request(options, (err, res, data) => {
					should.not.exists(err);
					should.exists(data);
					done()
				})
			})
		});
	});
});