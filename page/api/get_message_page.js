const supertest = require('supertest')
require('dotenv').config()

const api = supertest(process.env.BASEURL_URL)

const getMessage = (userId, tokenAccess) =>
	api
		.get(`/api/v1/message/${userId}`)
		.type('form')
		.set('accept', 'application/json')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', tokenAccess)
		
module.exports = {
	getMessage
};