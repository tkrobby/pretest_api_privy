const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/remove_account_page')
const pageRegister = require('../../page/api/register_page')
const schema = require('../../data/schema/api/register/remove_account_schema.json')
const code = require('../../helpers/response_status.json')

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)

const path = '/api/v1/register/remove';
const HTTPMethod = 'POST';

const testCase = {
	describe: `Remove account | ${HTTPMethod} ${path}`,
	preCondition: 'Already register phone number',
	positive: {
		userRemoveAccount : 'As a User, I want to be able remove account after register',
	},
	negative: {
		userRemoveAccountWithoutPhone : 'As a User, I won\'t be able remove account without parameter phone',
	}
};

let phoneResendOTP

describe(`@post @removeAccount ${testCase.describe}`, () => {
	before(`@post @removeAccount  ${testCase.preCondition}`, async () => {
		let PhoneNumber = '628919100' + randomNumber
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
	describe('@post @removeAccount Positive Case', () => {
		it(`@post @removeAccount  ${testCase.positive.userRemoveAccount}`, async () => {
				let paramRemoveAccount = {
					"phone": `${phoneResendOTP}`
				}
			const response = await page.removeAccount(paramRemoveAccount)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@post  @removeAccount Negative Case', () => {
		it(`@post @removeAccount ${testCase.negative.userRemoveAccountWithoutPhone}`, async () => {
			const response = await page.removeAccount()
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('phone is missing')
		})
	})
})