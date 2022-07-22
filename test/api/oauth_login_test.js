const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/oauth_login_page')
const data = require(`../../data/${stage}/api/oauth_login_data.json`)
const schema = require('../../data/schema/api/login/oauth_login_schema.json')
const schemaNotFind = require('../../data/schema/api/login/oauth_login_phone_not_find_schema.json')
const code = require('../../helpers/response_status.json')

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)

const path = '/api/v1/oauth/sign_in';
const HTTPMethod = 'POST';

const testCase = {
	describe: `User Get Credential | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userLoginFromiOS : 'As an User, I want to be able login from iOS',
	},
	negative: {
		userLoginWithPhoneNotRegister : 'As an User, I won\'t be able login with phone number not register',
	}
};

describe(`@post @login ${testCase.describe}`, () => {
	describe('@post @login Positive Case', () => {
		it(`@post @login  ${testCase.positive.userLoginFromiOS}`, async () => {
			const response = await page.oauthLogin(data.dataLoginiOS)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body.data.user.token_type).to.equal('bearer')
			assert(response.body).to.jsonSchema(schema)
		})
		it(`@post @login  ${testCase.positive.userLoginFromAndroid}`, async () => {
			const response = await page.oauthLogin(data.dataLoginAndroid)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body.data.user.token_type).to.equal('bearer')
			assert(response.body).to.jsonSchema(schema)
		})
		it(`@post @login  ${testCase.positive.userLoginFromWeb}`, async () => {
			const response = await page.oauthLogin(data.dataLoginWeb)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body.data.user.token_type).to.equal('bearer')
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@post @auth @register Negative Case', () => {
		it(`@post @auth @register ${testCase.negative.userLoginWithPhoneNotRegister}`, async () => {
			const response = await page.oauthLogin(data.dataLoginInvalid)
			assert(response.status).to.equal(code.errorUnprocessableEntity.codeNumber)
			assert(response.body).to.jsonSchema(schemaNotFind)
		})
		it(`@post @auth @register ${testCase.negative.userLoginWithoutParameterPhone}`, async () => {
			const response = await page.oauthLogin(data.withoutPhone)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('phone is missing')
		})
		it(`@post @auth @register ${testCase.negative.userLoginWithoutParameterPassword}`, async () => {
			const response = await page.oauthLogin(data.withoutPassword)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('password is missing')
		})
		it(`@post @auth @register ${testCase.negative.userLoginWithInvalidPassword}`, async () => {
			const response = await page.oauthLogin(data.invalidPassword)
			assert(response.status).to.equal(code.errorUnprocessableEntity.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid Password')
			assert(response.body).to.jsonSchema(schemaNotFind)
		})
	})
})