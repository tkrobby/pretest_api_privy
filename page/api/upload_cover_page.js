const supertest = require('supertest')
require('dotenv').config()
const buffer = Buffer.from('some data');

const api = supertest(process.env.BASEURL_URL)

const uploadCover = (tokenAccess) =>
	api
		.post('/api/v1/uploads/cover')
		.type('form')
		.set('accept', 'application/json')
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', tokenAccess)
		.attach('image', buffer,'../../helpers/image_test.png')
		
module.exports = {
	uploadCover
};