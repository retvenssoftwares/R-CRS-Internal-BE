const { check } = require('express-validator');

exports.create_event_validator = [
    check('event_name')
        .not()
        .isEmpty()
        .withMessage('Event name is required'),

    check('event_date')
        .not()
        .isEmpty()
        .withMessage('Event date is required'),

    check('host_by')
        .not()
        .isEmpty()
        .withMessage('Host by is required')
];
