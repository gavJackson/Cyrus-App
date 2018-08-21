module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
		node: true
	},
	extends: 'eslint:recommended',
	globals: {
		__static: true
	},
	plugins: [
		'html'
	],
	'rules': {
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		"no-mixed-spaces-and-tabs": [2, "smart-tabs"],

		// preventing errors in custom ace languages
		'no-useless-escape': 0,
		'no-unused-vars': 0,
		'no-undef': 0,
	}
}
