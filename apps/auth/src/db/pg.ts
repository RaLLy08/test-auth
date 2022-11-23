const { Client } = require('pg');

const client = new Client({
    password: process.env.DB_USER_PASSWORD,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
  
// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//       host : '',
//       port : '',
//       user : '',
//       password : '',
//       database : ''
//     }
// });


export const connection = client.connect();

connection.then(() => {
    console.log("DB Connection established", process.env.DB_PORT)
});

export default client;