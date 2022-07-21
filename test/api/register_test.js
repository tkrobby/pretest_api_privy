const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/register_page')
const data = require(`../../data/${stage}/api/register_data.json`)
const schema = require('../../data/schema/api/register/register_success_schema.json')
const code = require('../../helpers/response_status.json')

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)

const path = '/api/v1/register';
const HTTPMethod = 'POST';

const testCase = {
	describe: `User Register | ${HTTPMethod} ${path}`,
	preCondition: 'Already phone number active',
	positive: {
		userRegisterFromiOS : 'As an User, I want to be able register from iOS',
		userRegisterFromAndroid : 'As an User, I want to be able register from android',
		userRegisterFromWeb : 'As an User, I want to be able register from web',
	},
	negative: {
		userRegisterUsingPhoneNumberAlreadyTaken : 'As an User, I won\'t be able register with phone number already taken',
		userRegisterWithoutPhone : 'As an User, I won\'t be able register without phone number',
		userRegisterWithoutPassword : 'As an User, I won\'t be able register without password',
	}
};

describe(`@post @register ${testCase.describe}`, () => {
	describe('@post @register Positive Case', () => {
		it(`@post @register  ${testCase.positive.userRegisterFromiOS}`, async () => {
			let PhoneNumberiOS = '628119100' + randomNumber
			let paramRegister = {
				"phone": `${PhoneNumberiOS}`,
        		"password": "123123",
        		"country": "ID",
        		"latlong": "‑6.200000-106.816666",
        		"device_token": "12",
        		"device_type": "0"
			}
			const response = await page.registerPage(paramRegister)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body.data.user.phone).to.equal(PhoneNumberiOS)
			assert(response.body.data.user.user_status).to.equal('pending')
			assert(response.body.data.user.user_device.device_type).to.equal('ios')
			assert(response.body).to.jsonSchema(schema)
		})
		it(`@post @register  ${testCase.positive.userRegisterFromAndroid}`, async () => {
			let PhoneNumberAndroid = '628119101' + randomNumber
			let paramRegister = {
				"phone": `${PhoneNumberAndroid}`,
        		"password": "123123",
        		"country": "ID",
        		"latlong": "‑6.200000-106.816666",
        		"device_token": "12",
        		"device_type": "1"
			}
			const response = await page.registerPage(paramRegister)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body.data.user.phone).to.equal(PhoneNumberAndroid)
			assert(response.body.data.user.user_status).to.equal('pending')
			assert(response.body.data.user.user_device.device_type).to.equal('android')
			assert(response.body).to.jsonSchema(schema)
		})
		it(`@post @register  ${testCase.positive.userRegisterFromWeb}`, async () => {
			let PhoneNumberWeb = '628119102' + randomNumber
			let paramRegister = {
				"phone": `${PhoneNumberWeb}`,
        		"password": "123123",
        		"country": "ID",
        		"latlong": "‑6.200000-106.816666",
        		"device_token": "12",
        		"device_type": "2"
			}
			const response = await page.registerPage(paramRegister)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body.data.user.phone).to.equal(PhoneNumberWeb)
			assert(response.body.data.user.user_status).to.equal('pending')
			assert(response.body.data.user.user_device.device_type).to.equal('web')
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@post @auth @register Negative Case', () => {
		it(`@post @auth @register ${testCase.negative.userRegisterUsingPhoneNumberAlreadyTaken}`, async () => {
			const response = await page.registerPage(data.dataRegister)
			assert(response.status).to.equal(code.errorUnprocessableEntity.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Phone has already been taken')
		})
		it(`@post @auth @register ${testCase.negative.userRegisterWithoutPhone}`, async () => {
			const response = await page.registerPage(data.dataRegisterPhoneMissing)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('phone is missing')
		})
		it(`@post @auth @register ${testCase.negative.userRegisterWithoutPassword}`, async () => {
			const response = await page.registerPage(data.dataRegisterPasswordMissing)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('password is missing')
		})
	})
})