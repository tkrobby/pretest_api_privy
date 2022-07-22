const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()

const page = require('../../page/api/register_resend_otp_page')
const pageRegister = require('../../page/api/register_page')
const schema = require('../../data/schema/api/register/register_resend_otp_schema.json')
const code = require('../../helpers/response_status.json')

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)

const path = '/api/v1/register/otp/request';
const HTTPMethod = 'POST';

const testCase = {
	describe: `Register resend OTP | ${HTTPMethod} ${path}`,
	preCondition: 'Already register phone number',
	positive: {
		userResendOTPregister : 'As a User, I want to be able after register resend OTP',
	},
	negative: {
		userResendOTPWithoutPhone : 'As a User, I won\'t be able resend otp without parameter phone',
	}
};

let phoneResendOTP

describe(`@post @register ${testCase.describe}`, () => {
	before(`@post @register  ${testCase.preCondition}`, async () => {
		let PhoneNumber = '628149100' + randomNumber
		let paramRegister = {
			"phone": `${PhoneNumber}`,
			"password": "123123",
			"country": "ID",
			"latlong": "‑6.200000-106.816666",
			"device_token": "12",
			"device_type": "0"
		}
	const response = await pageRegister.registerPage(paramRegister)
	assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
	assert(response.body.data.user.phone).to.equal(PhoneNumber)
	phoneResendOTP = response.body.data.user.phone
	
})
	describe('@post @resendotp Positive Case', () => {
		it(`@post @resendotp  ${testCase.positive.userResendOTPregister}`, async () => {
				let paramResendOTP = {
					"phone": `${phoneResendOTP}`
				}
			const response = await page.registerResendOTP(paramResendOTP)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body.data.user.phone).to.equal(phoneResendOTP)
			assert(response.body.data.user.user_status).to.equal('pending')
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@post @resendotp Negative Case', () => {
		it(`@post @resendotp ${testCase.negative.userResendOTPWithoutPhone}`, async () => {
			const response = await page.registerResendOTP()
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('phone is missing')
		})
	})
})