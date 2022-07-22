const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/upload_cover_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
const schema = require('../../data/schema/api/upload/upload_cover_schema.json')
const code = require('../../helpers/response_status.json')


const path = '/api/v1/uploads/cover';
const HTTPMethod = 'POST';

const testCase = {
	describe: `User Get Profile | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userUploadCover : 'As an User, I want to be upload cover profile',
	},
	negative: {
		userUploadCoverWithInvalidAccessToke : 'As an User, I won\'t be upload cover profile with invalid token',
	}
};

let loginAccessToken

describe(`@post @profile ${testCase.describe}`, () => {
	before(`@post @profile  ${testCase.positive.userLoginFromiOS}`, async () => {
		const response = await pageLogin.oauthLogin(dataLogin.dataLoginiOS)
		assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
		assert(response.body.data.user.token_type).to.equal('bearer')
		loginAccessToken = response.body.data.user.access_token
	})
	describe('@get @profile Positive Case', () => {
		it(`@get @profile  ${testCase.positive.userUploadCover}`, async () => {
			const response = await page.uploadCover(loginAccessToken)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@get @profile Negative Case', () => {
		it(`@get @profile ${testCase.negative.userUploadCoverWithInvalidAccessToke}`, async () => {
			const response = await page.uploadCover('invalid')
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid token')
		})
	})
})