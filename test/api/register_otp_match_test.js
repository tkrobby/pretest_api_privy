const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/register_otp_match_page')
const pageRegister = require('../../page/api/register_page')
const data = require(`../../data/${stage}/api/register_otp_match_data.json`)
const schema = require('../../data/schema/api/register/register_otp_match_schema.json')
const schemaError = require('../../data/schema/api/register/register_otp_match_error_schema.json')
const code = require('../../helpers/response_status.json')

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)

const path = '/api/v1/register/otp/match';
const HTTPMethod = 'POST';

const testCase = {
	describe: `Register OTP match | ${HTTPMethod} ${path}`,
	preCondition: 'Already register phone number',
	positive: {
		userRegisterOTPMatch : 'As an User, I want to be able register otp match with valid user id and otp number',
	},
	negative: {
		userRegisterOTPMatchWithInvalidUserID : 'As an User, I won\'t be able register otp match with invalid user id',
		userRegisterOTPMatchWithoutUserID : 'As an User, I won\'t be able register otp match without user id parameter',
		userRegisterOTPMatchWithoutOTP : 'As an User, I won\'t be able register otp match without otp parameter',
	}
};

let user_id

describe(`@post @register ${testCase.describe}`, () => {
	before(`@post @register  ${testCase.preCondition}`, async () => {
		let PhoneNumberiOS = '628149100' + randomNumber
		let paramRegister = {
			"phone": `${PhoneNumberiOS}`,
			"password": "123123",
			"country": "ID",
			"latlong": "‑6.200000-106.816666",
			"device_token": "12",
			"device_type": "0"
		}
	const response = await pageRegister.registerPage(paramRegister)
	assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
	assert(response.body.data.user.phone).to.equal(PhoneNumberiOS)
	user_id = response.body.data.user.id
	
})
	describe('@post @register Positive Case', () => {
		it(`@post @register  ${testCase.positive.userRegisterOTPMatch}`, async () => {
				let paramRegisterOTPMatch = {
					"user_id": `${user_id}`,
					"otp_code": "1212",
				}
			const response = await page.registerOTPMatchPage(paramRegisterOTPMatch)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body.data.user.token_type).to.equal('bearer')
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@post @auth @register Negative Case', () => {
		it(`@post @auth @register ${testCase.negative.userRegisterOTPMatchWithInvalidUserID}`, async () => {
			const response = await page.registerOTPMatchPage(data.dataRegisterOTPMatchInvalid)
			assert(response.status).to.equal(code.internalServerError.codeNumber)
			assert(response.body).to.jsonSchema(schemaError)
		})
		it(`@post @auth @register ${testCase.negative.userRegisterOTPMatchWithoutUserID}`, async () => {
			const response = await page.registerOTPMatchPage(data.registerOTPMatchWithoutUserId)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('user_id is missing')
		})
		it(`@post @auth @register ${testCase.negative.userRegisterOTPMatchWithoutOTP}`, async () => {
			const response = await page.registerOTPMatchPage(data.registerOTPMatchWithoutOTP)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('otp_code is missing')
		})
	})
})