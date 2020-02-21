const semver = require('semver')

const checkMinRC = version => {
	try {
		return semver.prerelease(semver.minVersion(version)) !== null
	} catch (e) {
		return true
	}
}

const checkObjectDeps = obj => (
	Object.keys(obj)
		.filter(key => checkMinRC(obj[key]))
		.map(key => `Non stable version found for package ${key}: ${obj[key]}`)
)

const depsKeys = ['dependencies', 'devDependencies']

const validateFileDependencies = packageJSON => {
	let packageObj
	let errorList
	try {
		packageObj = JSON.parse(packageJSON)
		errorList = depsKeys
						.filter(depKey => packageObj.hasOwnProperty(depKey))
						.map(depKey => packageObj[depKey])
						.map(checkObjectDeps)
						.reduce((acc, val) => acc.concat(val), [])
	} catch (e) {
		throw new Error('Invalid package.json format')
	}
	if (errorList.length > 0) {
		const error = errorList.join('\n')
		throw new Error(error)
	}

	return 0
}

module.exports = validateFileDependencies
