const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/upload_set_default_profile_page')
const pageUpload = require('../../page/api/upload_profile_page')
const pageLogin = require('../../page/api/oauth_login_page')
const dataLogin = require(`../../data/${stage}/api/oauth_login_data.json`)
const schema = require('../../data/schema/api/upload/upload_set_default_profile_schema.json')
const code = require('../../helpers/response_status.json')


const path = '/api/v1/uploads/profile/default';
const HTTPMethod = 'POST';

const testCase = {
	describe: `User Set Default Profile | ${HTTPMethod} ${path}`,
	preCondition: 'Already Login',
	positive: {
		userSetDefaultProfile : 'As an User, I want to be set default profile',
	},
	negative: {
		userSetDefaultProfileWithInvalidAccessToken : 'As an User, I won\'t be set default profile with invalid token',
		userSetDefaultProfileWithInvalidIdProfile : 'As an User, I won\'t be set default profile with invalid id profile',
		userSetDefaultProfileWithoutIdProfile : 'As an User, I won\'t be set default profile without id profile',
	}
};

let loginAccessToken
let idProfile

describe(`@post @upload ${testCase.describe}`, () => {
	before(`@post @upload  ${testCase.positive.userLoginFromiOS}`, async () => {
		const response = await pageLogin.oauthLogin(dataLogin.dataLoginiOS)
		assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
		assert(response.body.data.user.token_type).to.equal('bearer')
		loginAccessToken = response.body.data.user.access_token
		const responseUpload = await pageUpload.uploadProfile(loginAccessToken)
		assert(responseUpload.status).to.equal(code.successCreated.codeNumber, responseUpload.body)
		idProfile = responseUpload.body.data.user_picture.id
		console.log(idProfile)
	})
	describe('@get @upload Positive Case', () => {
		it(`@get @upload  ${testCase.positive.userSetDefaultProfile}`, async () => {
			let paramRegister = {
				"id" : `${idProfile}`
			}
			const response = await page.uploadSetDefaultProfile(paramRegister,loginAccessToken)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
			assert(response.body).to.jsonSchema(schema)
		})
	})
	describe('@get @upload Negative Case', () => {
		it(`@get @upload ${testCase.negative.userSetDefaultProfileWithInvalidAccessToken}`, async () => {
			let paramRegister = {
				"id" : `${idProfile}`
			}
			const response = await page.uploadSetDefaultProfile(paramRegister,'invalid')
			assert(response.status).to.equal(code.errorUnauthorized.codeNumber)
			assert(response.body.error.errors[0]).to.equal('Invalid token')
		})
		it(`@get @upload ${testCase.negative.userSetDefaultProfileWithInvalidIdProfile}`, async () => {
			let paramRegister = {
				"id" : `${idProfile}+1`
			}
			const response = await page.uploadSetDefaultProfile(paramRegister,loginAccessToken)
			assert(response.status).to.equal(code.internalServerError.codeNumber)
		})
		it(`@get @upload ${testCase.negative.userSetDefaultProfileWithoutIdProfile}`, async () => {
			const response = await page.uploadSetDefaultProfile('',loginAccessToken)
			assert(response.status).to.equal(code.errorNotAcceptabble.codeNumber)
			assert(response.body.error.errors[0]).to.equal('id is missing')
		})
	})
})