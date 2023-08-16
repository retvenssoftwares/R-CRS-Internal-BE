const { check } = require('express-validator');

exports.create_task_validator = [
    check('project_id')
        .not()
        .isEmpty()
        .withMessage('Project Id is required'),

    check('assignee')
        .not()
        .isEmpty()
        .withMessage('Assignee is required'),

    check('follower')
        .not()
        .isEmpty()
        .withMessage('Follower is required'),

    check('owner')
        .not()
        .isEmpty()
        .withMessage('Owner is required'),

    check('title')
        .not()
        .isEmpty()
        .withMessage('Task title is required'),

    check('deadline')
        .not()
        .isEmpty()
        .withMessage('Deadline is required')
];
