const { check } = require('express-validator');

exports.create_department_validator = [
    check('departmentName')
        .not()
        .isEmpty()
        .withMessage('Department name is required')
];
