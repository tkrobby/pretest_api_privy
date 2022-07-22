const supertest = require('supertest')
require('dotenv').config()
const buffer = Buffer.from('some data');

const api = supertest(process.env.BASEURL_URL)

const uploadSetDefaultProfile = (payload,tokenAccess) =>
	api
		.post('/api/v1/uploads/profile/default')
		.type('form')
		.set('accept', 'application/json')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', tokenAccess)
		.send(payload)
		
module.exports = {
	uploadSetDefaultProfile
};