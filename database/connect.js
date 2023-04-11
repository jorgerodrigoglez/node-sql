
/*module.exports = {

    database : {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
}*/

const database = {
  connectionLimit: 10,
  host: process.env.HOST || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE || "calendar_app",
};

module.exports = database