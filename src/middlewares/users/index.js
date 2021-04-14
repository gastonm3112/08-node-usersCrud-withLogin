const { check, validationResult } = require('express-validator');
const AppError = require('../../errors/appError');
const userService = require('../../services/userService');
const { ROLES } = require('../../constants');

const _nameRequired = check('name', 'Name required').not().isEmpty();
const _lastNameRequired = check('lastName', 'Last Name required').not().isEmpty();

const _emailRequired = check('email', 'Email required').not().isEmpty();
const _emailValid = check('email', 'Email is invalid').isEmail();
const _emailExist = check('email').custom(
	async (email = '') => {
		const userFound = await userService.findByEmail(email);
		if (userFound) {
			throw new AppError('Email already exist in DB', 400);
		}
	}
);

const _optionalEmailValid = check('email', 'Email is invalid').optional().isEmail();
const _optionalEmailExist = check('email').optional().custom(
	async (email = '') => {
		const userFound = await userService.findByEmail(email);
		if (userFound) {
			throw new AppError('Email already exist in DB', 400);
		}
	}
);


const _passwordRequired = check('password', 'Password required').not().isEmpty();

const _roleValid = check('role').optional().custom(
	async (role = '') => {
		if (!ROLES.includes(role)) {
			throw new AppError('Invalid Role', 400);
		}
	}
);

const _dateValid = check('birthdate').optional().isDate('MM-DD-YYYY');

const _idrequired = check('id').not().isEmpty();
const _idIsMongoDB = check('id').isMongoId();
const _idExist = check('id').custom(
	async (id = '') => {
		const userFound = await userService.findById(id);
		if (!userFound) {
			throw new AppError('The id does not exist in DB', 400);
		}
	}
);


const _validationResult = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new AppError('Validation Errors', 400, errors.errors);
	}
	next();
};

const postRequestValidations = [
	_nameRequired,
	_lastNameRequired,
	_emailRequired,
	_emailValid,
	_emailExist,
	_passwordRequired,
	_roleValid,
	_dateValid,
	_validationResult,
];

const putRequestValidations = [
	_idrequired,
	_idIsMongoDB,
	_idExist,
	_optionalEmailValid,
	_optionalEmailExist,
	_roleValid,
	_dateValid,
	_validationResult,
]

module.exports = {
	postRequestValidations,
	putRequestValidations,

};
