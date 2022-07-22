const supertest = require('supertest')
require('dotenv').config()

const api = supertest(process.env.BASEURL_URL)

const cekStatusAppVersion = (groupId,tokenAccess) =>
	api
		.post(`/api/v1/notification/${groupId}/${tokenAccess}`)
		.type('form')
		.set('accept', 'application/json')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		
module.exports = {
	cekStatusAppVersion
};