const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/oauth_revoke_page')
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
		userRevokeAccessToken : 'As an User, I want to be able revoke access token',
	},
	negative: {
		userRevokeAccessTokenWithInvalidToken : 'As an User, I won\'t be able revoke with invalid token',
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
	describe('@get @revoke Positive Case', () => {
		it(`@get @revoke  ${testCase.positive.userRevokeAccessToken}`, async () => {
			let paramRevoke = {
				"access_token": `${loginAccessToken}`,
				"confirm": "1"
			}
			const response = await page.userRevoke(paramRevoke)
			assert(response.status).to.equal(code.successOk.codeNumber, response.body)
		})
	})
	describe('@get @revoke Negative Case', () => {
		it(`@get @revoke ${testCase.negative.userRevokeAccessTokenWithInvalidToken}`, async () => {
			let paramRevoke = {
				"confirm": "1"
			}
			const response = await page.userRevoke(paramRevoke)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('access_token is missing')
		})
	})
})