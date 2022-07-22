const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/profile_update_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
const data = require(`../../data/${stage}/api/profile_update_data.json`)
const schema = require('../../data/schema/api/profile/profile_update_schema.json')
const code = require('../../helpers/response_status.json')


const path = '/api/v1/oauth/credentials/{access_token}';
const HTTPMethod = 'POST';

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)

const testCase = {
	describe: `User Update Profile | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userUpdateProfile : 'As an User, I want to be able update profile',
	},
	negative: {
		userUpdateProfileWithInvalidAccessToke : 'As an User, I won\'t be update profile with invalid token',
		userUpdateProfileWithoutParameterName : 'As an User, I won\'t be update profile without parameter name',
		userUpdateProfileWithoutParameterGender : 'As an User, I won\'t be update profile without parameter gender',
		userUpdateProfileWithoutParameterBirthday : 'As an User, I won\'t be update profile without parameter birthday',
		userUpdateProfileWithInvalidParameterBirthday : 'As an User, I won\'t be update profile with invalid parameter birthday',
		userUpdateProfileWithoutParameterHometown : 'As an User, I won\'t be update profile without parameter hometown',
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
	describe('@post @profile Positive Case', () => {
		it(`@post @profile  ${testCase.positive.userUpdateProfile}`, async () => {
			let paramUpdateProfile = {
				"name": `John Doe Jo + ${loginAccessToken}`,
				"gender": "0",
				"birthday": "12-12-1997",
				"hometown" : "Bandung",
				"bio" : "GAS"
			}
			const response = await page.updateProfile(paramUpdateProfile,loginAccessToken)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
		})
	})
	describe('@post @profile Negative Case', () => {
		it(`@post @profile ${testCase.negative.userUpdateProfileWithInvalidAccessToke}`, async () => {
			let paramUpdateProfile = {
				"name": `John Doe Jo + ${loginAccessToken}`,
				"gender": "0",
				"birthday": "12-12-1997",
				"hometown" : "Bandung",
				"bio" : "GAS"
			}
			const response = await page.updateProfile(paramUpdateProfile,'invalid')
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid token')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileWithoutParameterName}`, async () => {
			const response = await page.updateProfile(data.dataUpdateProfileWithoutName,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('name is missing')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileWithoutParameterGender}`, async () => {
			const response = await page.updateProfile(data.dataUpdateProfileWithoutGender,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('gender is missing, gender does not have a valid value')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileWithoutParameterBirthday}`, async () => {
			const response = await page.updateProfile(data.dataUpdateProfileWithoutBirthday,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('birthday is missing')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileWithInvalidParameterBirthday}`, async () => {
			const response = await page.updateProfile(data.dataUpdateProfileInvalidFormatBirthday,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('birthday is invalid')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileWithoutParameterHometown}`, async () => {
			const response = await page.updateProfile(data.dataUpdateProfileWithoutHometown,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('hometown is missing')
		})
	})
})