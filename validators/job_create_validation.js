
const { check } = require('express-validator');
exports.job_create_validator = [
    check('job_title')
      .not()
      .isEmpty()
      .withMessage('Please give a title to the job'),

      check('apply_by')
      .not()
      .isEmpty()
      .withMessage('Please provide the time before which people can apply'),

      check('description')
      .not()
      .isEmpty()
      .withMessage('Please describe the job'),

      check('job_type')
      .not()
      .isEmpty()
      .withMessage('Please provide type of job'),

      check('vacancy')
      .not()
      .isEmpty()
      .withMessage('Please provide the number of open vancancies'),

]