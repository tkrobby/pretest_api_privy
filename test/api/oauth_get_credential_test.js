const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/oauth_get_credential_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
const schema = require('../../data/schema/api/login/oauth_get_credential_schema.json')
const code = require('../../helpers/response_status.json')


const path = '/api/v1/oauth/credentials/{access_token}';
const HTTPMethod = 'GET';

const testCase = {
	describe: `User Get Credential | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userGetCredential : 'As an User, I want to be able get credential',
	},
	negative: {
		userGetCredentialWithInvalidToken : 'As an User, I won\'t be able get credential with invalid token',
	}
};

let loginAccessToken

describe(`@get @credential ${testCase.describe}`, () => {
	before(`@get @credential  ${testCase.positive.userLoginFromiOS}`, async () => {
		const response = await pageLogin.oauthLogin(dataLogin.dataLoginiOS)
		assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
		assert(response.body.data.user.token_type).to.equal('bearer')
		loginAccessToken = response.body.data.user.access_token
	})
	describe('@get @credential Positive Case', () => {
		it(`@get @credential  ${testCase.positive.userGetCredential}`, async () => {
			const response = await page.getCredenntial(loginAccessToken)
			assert(response.status).to.equal(code.successOk.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@get @credential Negative Case', () => {
		it(`@get @credential ${testCase.negative.userGetCredentialWithInvalidToken}`, async () => {
			const response = await page.getCredenntial()
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0].error).to.equal('The access token is invalid')
		})
	})
})