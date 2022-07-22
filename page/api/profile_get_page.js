const supertest = require('supertest')
require('dotenv').config()

const api = supertest(process.env.BASEURL_URL)

const getProfile = (tokenAccess) =>
	api
		.get('/api/v1/profile/me')
		.type('form')
		.set('accept', 'application/json')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', tokenAccess)
		
module.exports = {
	getProfile
};