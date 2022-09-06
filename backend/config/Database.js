import { Sequelize } from "sequelize";

const db = new Sequelize('upload_db','root','',{
    host: 'localhost',
    dialect: 'mysql',
})

export default db;

// Or
/*
import mysql from 'mysql2';
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'klok-19-10-18',
    database: 'crudapi'
});

export default db;
*/
