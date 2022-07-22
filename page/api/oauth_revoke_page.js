const supertest = require('supertest')
require('dotenv').config()

const api = supertest(process.env.BASEURL_URL)

const userRevoke = (payload) =>
	api
		.post('/api/v1/oauth/revoke')
		.type('form')
		.set('accept', 'application/json')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.send(payload)
		
module.exports = {
	userRevoke
};