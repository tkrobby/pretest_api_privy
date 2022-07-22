const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/profile_get_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
const data = require(`../../data/${stage}/api/profile_update_data.json`)
const schema = require('../../data/schema/api/profile/profile_update_schema.json')
const code = require('../../helpers/response_status.json')


const path = '/api/v1/profile/me';
const HTTPMethod = 'GET';

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)

const testCase = {
	describe: `User Get Profile | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userGetProfile : 'As an User, I want to be able get profile',
	},
	negative: {
		userGetProfileWithInvalidAccessToke : 'As an User, I won\'t be get profile with invalid token',
	}
};

let loginAccessToken

describe(`@post @profile ${testCase.describe}`, () => {
	before(`@post @profile  ${testCase.positive.userLoginFromiOS}`, async () => {
		const response = await pageLogin.oauthLogin(dataLogin.dataLoginiOS)
		assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
		assert(response.body.data.user.token_type).to.equal('bearer')
		loginAccessToken = response.body.data.user.access_token
	})
	describe('@get @profile Positive Case', () => {
		it(`@get @profile  ${testCase.positive.userGetProfile}`, async () => {
			const response = await page.getProfile(loginAccessToken)
			assert(response.status).to.equal(code.successOk.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@get @profile Negative Case', () => {
		it(`@get @profile ${testCase.negative.userGetProfileWithInvalidAccessToke}`, async () => {
			const response = await page.getProfile('invalid')
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid token')
		})
	})
})