#!/usr/bin/env node

const validateFileDependencies = require('./validate-file-dependencies')
const fs = require('fs').promises

const paths = process.argv.slice(2)

const colors = {
	red: "\x1b[31m",
	green: "\x1b[32m",
}

let hasError = false
const logError = e => {
	hasError = true
	console.log(colors.red + e)
}
const logSuccess = e => console.log(colors.green + e)

const processFile = path => (
	fs.open(path)
		.then(file => file.readFile('utf8'))
		.then(data => {
			try {
				validateFileDependencies(data)
			} catch (e) {
				return {
					error: true,
					message: 'Error for file ' + path + '\n\t' + e.message.replace(/\n/g, '\n\t')
				}
			}
			return {
				error: false,
				message: 'File validated ' + path
			}
		})
)

Promise.all(paths.map(processFile)).then(results => {
	results.forEach(res => {
		if (res.error) {
			logError(res.message)
		} else {
			logSuccess(res.message)
		}
	})
}).then(() => {
	process.exit(hasError ? 1 : 0)
}).catch(console.log)
