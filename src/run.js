'use strict'

const path    = require('path')
const mm      = require('micromatch')
const klaw    = require('klaw')
const rename  = require('rename-extension')
const execute = require('./execute')
const save    = require('./save')

/**
 * Run multiple route functions parallel.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {String} srcPath - Path to the source folder.
 * @param {String} distPath - Path to the destination folder.
 * @param {Object} opts - Additional optional options.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, opts, next) {

	const getHandlerFn = (filePath) => {

		// Set file path relative to the src path as route paths are relative, too
		const fileRoute = path.relative(srcPath, filePath)

		// Generate an array of matching routes and use the first matching route only
		const matches = routes.filter((route) => mm.isMatch(fileRoute, route.path))
		const route   = matches[0]

		// Return resolved promise when no matching route found
		if (route==null) return Promise.resolve()

		// Save file in distPath at the same location as in srcPath,
		// but with a different extension.
		const fileSave = (() => {

			// Switch from src to dist
			const fileDist = filePath.replace(srcPath, distPath)

			// Check if fn exists
			const hasFn = (typeof route.handler.out==='function')

			return (hasFn===true ? rename(fileDist, route.handler.out(route.opts)) : fileDist)

		})()

		// Return promise when matching route found
		return new Promise((resolve, reject) => {

			// Execute handler
			execute(route, fileRoute, filePath, true, (err, data) => {

				if (err!=null) return reject(err)

				// Save file to disk
				save(fileSave, data, opts, (err) => {

					if (err!=null) return reject(err)

					resolve()

				})

			})

		})

	}

	// Array of fns to execute
	const query = []

	klaw(srcPath).on('data', (file) => {

		const fn = getHandlerFn(file.path)

		// Store handler fn in query
		query.push(fn)

	}).on('end', () => {

		// Wait for each promise to resolve and continue with next.
		// Ensure that the first parameter of next is empty.
		Promise.all(query).then(() => next(), next)

	})

}