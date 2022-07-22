const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/upload_profile_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
const schema = require('../../data/schema/api/upload/upload_profile_schema.json')
const code = require('../../helpers/response_status.json')


const path = '/api/v1/uploads/profile';
const HTTPMethod = 'POST';

const testCase = {
	describe: `User Upload Profile | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userUploadCover : 'As an User, I want to be upload profile',
	},
	negative: {
		userUploadCoverWithInvalidAccessToke : 'As an User, I won\'t be upload profile with invalid token',
	}
};

let loginAccessToken

describe(`@post @upload ${testCase.describe}`, () => {
	before(`@post @upload  ${testCase.positive.userLoginFromiOS}`, async () => {
		const response = await pageLogin.oauthLogin(dataLogin.dataLoginiOS)
		assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
		assert(response.body.data.user.token_type).to.equal('bearer')
		loginAccessToken = response.body.data.user.access_token
	})
	describe('@get @upload Positive Case', () => {
		it(`@get @upload  ${testCase.positive.userUploadCover}`, async () => {
			const response = await page.uploadProfile(loginAccessToken)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@get @upload Negative Case', () => {
		it(`@get @upload ${testCase.negative.userUploadCoverWithInvalidAccessToke}`, async () => {
			const response = await page.uploadProfile('invalid')
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid token')
		})
	})
})