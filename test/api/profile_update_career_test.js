const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/profile_update_career_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
const data = require(`../../data/${stage}/api/profile_update_career_data.json`)
const schema = require('../../data/schema/api/profile/profile_update_schema.json')
const code = require('../../helpers/response_status.json')

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)

const path = '/api/v1/profile/career';
const HTTPMethod = 'POST';

const testCase = {
	describe: `User Update Profile Career | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userUpdateProfileCareerFieldPosition : 'As an User, I want to be able update profile career field position',
		userUpdateProfileCareerFieldCompanyName : 'As an User, I want to be able update profile career field companny name',
	},
	negative: {
		userUpdateProfileCareerWithInvalidAccessToken : 'As an User, I won\'t be update profile career with invalid token',
		userUpdateProfileCareerWithoutPosition : 'As an User, I won\'t be update profile career without position',
		userUpdateProfileCareerWithoutCompanyName : 'As an User, I won\'t be update profile career without company name',
		userUpdateProfileCareerWithoutStartingFrom : 'As an User, I won\'t be update profile career without starting from',
		userUpdateProfileCareerWithoutEndingIn: 'As an User, I won\'t be update profile career without Ending In',
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
		it(`@post @profile  ${testCase.positive.userUpdateProfileCareerFieldPosition}`, async () => {
			let paramUpdateProfileCareer = {
				"position": `Lead SDET ${randomNumber}`,
				"company_name": "META",
				"starting_from": "09-09-2020",
				"ending_in" : "01-01-2022"
			}
			const response = await page.updateProfileCareer(paramUpdateProfileCareer,loginAccessToken)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
		it(`@post @profile  ${testCase.positive.userUpdateProfileCareerFieldCompanyName}`, async () => {
			let paramUpdateProfileCareer = {
				"position": "Lead SDET",
				"company_name": `META ${randomNumber}`,
				"starting_from": "09-09-2020",
				"ending_in" : "01-01-2022"
			}
			const response = await page.updateProfileCareer(paramUpdateProfileCareer,loginAccessToken)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@post @profile Negative Case', () => {
		it(`@post @profile ${testCase.negative.userUpdateProfileCareerWithInvalidAccessToken}`, async () => {
			let paramUpdateProfileCareer = {
				"position": `Lead SDET ${randomNumber}`,
				"company_name": "META",
				"starting_from": "09-09-2020",
				"ending_in" : "01-01-2022"
			}
			const response = await page.updateProfileCareer(paramUpdateProfileCareer,'invalid')
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid token')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileCareerWithoutPosition}`, async () => {
			const response = await page.updateProfileCareer(data.dataUpdateProfileCareerWithoutPosition,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('position is missing')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileCareerWithoutCompanyName}`, async () => {
			const response = await page.updateProfileCareer(data.dataUpdateProfileCareerWithoutCompanyName,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('company_name is missing')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileCareerWithoutStartingFrom}`, async () => {
			const response = await page.updateProfileCareer(data.dataUpdateProfileCareerWithoutStartingFrom,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('starting_from is missing')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileCareerWithoutEndingIn}`, async () => {
			const response = await page.updateProfileCareer(data.dataUpdateProfileCareerEndingIn,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('ending_in is missing')
		})
	})
})