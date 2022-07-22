const supertest = require('supertest')
require('dotenv').config()

const api = supertest(process.env.BASEURL_URL)

const getCredenntial = (accessToken) =>
	api
		.get(`/api/v1/oauth/credentials?access_token=${accessToken}`)
		.type('form')
		.set('accept', 'application/json')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		
module.exports = {
	getCredenntial
};