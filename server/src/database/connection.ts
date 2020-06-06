import knex from 'knex';
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile');

const connection = knex(configuration[environment]);

export default connection;
