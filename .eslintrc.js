module.exports = {
	env: {
		node: true,
		es6: true
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: '2019'
	},
	plugins: ['prettier'],
	extends: ['google', 'eslint:recommended', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		'require-jsdoc': 'off',
		'prefer-promise-reject-errors': 'off'
	}
};
