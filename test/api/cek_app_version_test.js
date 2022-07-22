const chai = require('chai')
const assert = require('chai').expect
chai.use(require('chai-json-schema'))
require('dotenv').config()
const stage = process.env.STAGE

const page = require('../../page/api/cek_app_version_page')
const code = require('../../helpers/response_status.json')


const path = '/api/v1/notification/${groupId}/${tokenAccess}';
const HTTPMethod = 'POST';

const testCase = {
	describe: `User Get Profile | ${HTTPMethod} ${path}`,
	preCondition: 'Have Token',
	positive: {
		userCekAppVersion : 'As an User, I want to be cek app version',
	},
};

const token = 'b488272b70b997f644a60c47af2a50ea3ffe698068c2cf883f59f9ec4111341c'

describe(`@post @profile ${testCase.describe}`, () => {
	describe('@get @cekAppVersion Positive Case', () => {
		it(`@get @profile  ${testCase.positive.userCekAppVersion}`, async () => {
			const response = await page.cekStatusAppVersion(12,token)
			assert(response.status).to.equal(code.successCreated.codeNumber, response.body)
		})
	})
})