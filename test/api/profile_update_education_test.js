const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/profile_update_education_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
const data = require(`../../data/${stage}/api/profile_update_education_data`)
const schema = require('../../data/schema/api/profile/profile_update_schema.json')
const code = require('../../helpers/response_status.json')

//init data
let range = {min: 200, max: 1500}
let delta = range.max - range.min

const randomNumber = Math.round(range.min + Math.random() * delta)

const path = '/api/v1/profile/education';
const HTTPMethod = 'POST';

const testCase = {
	describe: `User Update Profile Education | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userUpdateProfileEducation : 'As an User, I want to be able update profile education',
	},
	negative: {
		userUpdateProfileEducationWithInvalidAccessToke : 'As an User, I won\'t be update profile education with invalid token',
		userUpdateProfileEducationWithoutSchoolName: 'As an User, I won\'t be update profile education without parameter school name',
		userUpdateProfileEducationWithoutGraduationTime: 'As an User, I won\'t be update profile education without parameter graduation time',
		userUpdateProfileEducationWithInvalidGraduationTime: 'As an User, I won\'t be update profile education with invalid format parameter graduation time',
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
		it(`@post @profile  ${testCase.positive.userUpdateProfileEducation}`, async () => {
			let paramUpdateProfileEducation = {
				"school_name": `TELKOM ${randomNumber}`,
				"graduation_time": "12-12-1997"
			}
			const response = await page.updateProfileEducation(paramUpdateProfileEducation,loginAccessToken)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@post @profile Negative Case', () => {
		it(`@post @profile ${testCase.negative.userUpdateProfileEducationWithInvalidAccessToke}`, async () => {
			let paramUpdateProfileEducation = {
				"school_name": `TELKOM ${randomNumber}`,
				"graduation_time": "12-12-1997"
			}
			const response = await page.updateProfileEducation(paramUpdateProfileEducation,'invalid')
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid token')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileEducationWithoutSchoolName}`, async () => {
			const response = await page.updateProfileEducation(data.dataUpdateProfileEducationWithoutName,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('school_name is missing')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileEducationWithoutGraduationTime}`, async () => {
			const response = await page.updateProfileEducation(data.dataUpdateProfileEducationWithoutGraduationTime,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('graduation_time is missing')
		})
		it(`@post @profile ${testCase.negative.userUpdateProfileEducationWithInvalidGraduationTime}`, async () => {
			const response = await page.updateProfileEducation(data.dataUpdateProfileEducationWithInvalidFormatDate,loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('graduation_time is invalid')
		})
	})
})