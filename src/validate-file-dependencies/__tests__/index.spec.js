const validateFileDependencies = require('../')

const releaseCandidateMocks = {
	"package-that-throws": "4.2.0-rc1",
	"and-package-that-throws": "4.2.0-rc.1",
	"other-package-that-throws": "4.0.4-rc.2",
	"another-package-that-throws": "^4.2.9-rc.1",
	"yaptt": "0.10.1-rc.c4f3f999.8+c4f3f999",
}

describe('Given a valid JSON object', () => {
	let validJSON
	beforeEach(() => {
		validJSON = {
			"dependencies": {
				"package": "1.0.0",
			},
			"devDependencies": {
				"package": "1.0.0",
			},
		}
		validJSON = JSON.stringify(validJSON)
	})

	describe('with no non-stable versions', () => {
		it('should return 0', () => {
			expect(validateFileDependencies(validJSON)).toBe(0)
		})
	})

	describe('with non-stable versions', () => {
		beforeEach(() => {
			validJSON = {
				dependencies: {
					...validJSON.dependencies,
					...releaseCandidateMocks,
				},
				devDependencies: {
					...validJSON.devDependencies,
					...releaseCandidateMocks,					
				},
			}
			validJSON = JSON.stringify(validJSON)
		})

		it('should throw an error naming every package with non-stable version', () => {
			expect(() => validateFileDependencies(validJSON)).toThrowErrorMatchingSnapshot()
		})
	})

})

describe('Given an invalid JSON object', () => {
	let invalidJSON = "asd"

	it('should throw an error', () => {
		expect(() => validateFileDependencies(invalidJSON)).toThrowErrorMatchingSnapshot()
	})
})