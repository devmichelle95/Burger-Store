const { format } = require("prettier")

module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgred',
    database:'postgres',
    
    define:{
        timespamps: true,
        underscored: true,
        underscoredAll: true,
        }
}
