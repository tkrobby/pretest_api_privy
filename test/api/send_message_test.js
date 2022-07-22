const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/send_message_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
// const schema = require('../../data/schema/api/upload/upload_set_default_profile_schema.json')
const code = require('../../helpers/response_status.json')

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)


const path = '/api/v1/message/send';
const HTTPMethod = 'POST';

const testCase = {
	describe: `User send message | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userSendMessage : 'As an User, I want to be send message',
	},
	negative: {
		userSendMessageWithInvalidAccessToken : 'As an User, I won\'t be set default profile with invalid token',
		userSendMessageWithoutUserId : 'As an User, I won\'t be set default profile without parameter user id',
		userSendMessageWithoutMessage : 'As an User, I won\'t be set default profile without parameter message',
	}
};

let loginAccessToken

describe(`@post @sendMessage ${testCase.describe}`, () => {
	before(`@post @sendMessage  ${testCase.positive.userLoginFromiOS}`, async () => {
		const response = await pageLogin.oauthLogin(dataLogin.dataLoginiOS)
		assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
		assert(response.body.data.user.token_type).to.equal('bearer')
		loginAccessToken = response.body.data.user.access_token
	})
	describe('@post @sendMessage Positive Case', () => {
		it(`@post @sendMessage  ${testCase.positive.userSendMessage}`, async () => {
			let paramSendMessage = {
				"user_id" : '564829b1-fb64-463d-a0f6-a9c180a59cb0',
				"message" : `Testing ${randomNumber}`
			}
			const response = await page.sendMessage(paramSendMessage,loginAccessToken)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body.data).to.equal('Success send message')
		})
	})
	describe('@post @sendMessage Negative Case', () => {
		it(`@post @sendMessage ${testCase.negative.userSendMessageInvalidAccessToken}`, async () => {
			let paramSendMessage = {
				"user_id" : '564829b1-fb64-463d-a0f6-a9c180a59cb0',
				"message" : `Testing ${randomNumber}`
			}
			const response = await page.sendMessage(paramSendMessage,'invalid')
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid token')
		})
		it(`@post @sendMessage ${testCase.negative.userSendMessageWithoutUserId}`, async () => {
			let paramSendMessage = {
				"message" : `Testing ${randomNumber}`
			}
			const response = await page.sendMessage(paramSendMessage,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('user_id is missing')
		})
		it(`@post @sendMessage ${testCase.negative.userSendMessageWithoutMessage}`, async () => {
			let paramSendMessage = {
				"user_id" : '564829b1-fb64-463d-a0f6-a9c180a59cb0'
			}
			const response = await page.sendMessage(paramSendMessage,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('message is missing')
		})
	})
})