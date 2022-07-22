const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/get_message_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
const schema = require('../../data/schema/api/message/get_message_schema.json')
const code = require('../../helpers/response_status.json')


const path = '/api/v1/message/send';
const HTTPMethod = 'POST';

const testCase = {
	describe: `Get message | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userGetMessage : 'As an User, I want to be get message',
	},
	negative: {
		userGetWithInvalidAccessToken : 'As an User, I won\'t be get message with invalid token',
	}
};

let loginAccessToken
const userId = '564829b1-fb64-463d-a0f6-a9c180a59cb0'

describe(`@post @sendMessage ${testCase.describe}`, () => {
	before(`@post @sendMessage  ${testCase.positive.userLoginFromiOS}`, async () => {
		const response = await pageLogin.oauthLogin(dataLogin.dataLoginiOS)
		assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
		assert(response.body.data.user.token_type).to.equal('bearer')
		loginAccessToken = response.body.data.user.access_token
	})
	describe('@get @message Positive Case', () => {
		it(`@get @message  ${testCase.positive.userGetMessage}`, async () => {
			const response = await page.getMessage(userId,loginAccessToken)
			assert(response.status).to.equal(code.successOk.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@get @message Negative Case', () => {
		it(`@get @message ${testCase.negative.userGetWithInvalidAccessToken}`, async () => {
			const response = await page.getMessage(userId,'invalid')
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid token')
		})
	})
})