const supertest = require('supertest')
require('dotenv').config()

const api = supertest(process.env.BASEURL_URL)

const sendMessage = (payload, tokenAccess) =>
	api
		.post('/api/v1/message/send')
		.type('form')
		.set('accept', 'application/json')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', tokenAccess)
		.send(payload)
		
module.exports = {
	sendMessage
};