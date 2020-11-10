module.exports = {
    "development": {
        "username": process.env.DEV_DB_USR,
        "password": process.env.DEV_DB_PWD,
        "database": process.env.DEV_DB_NAME,
        "host": process.env.DEV_DB_HOST,
        "port" : process.env.DEV_DB_HOST,
        "dialect": "mysql",
        "define" : {
            "underscored" : true,
            "timestamps" : false
        }
    },
    "test": {
        "username": process.env.TEST_DB_USR,
        "password": process.env.TEST_DB_PWD,
        "database": process.env.TEST_DB_NAME,
        "host": process.env.TEST_DB_HOST,
        "port" : process.env.TEST_DB_HOST,
        "dialect": "mysql",
        "define" : {
            "underscored" : true,
            "timestamps" : false
        }
    },
    "production": {
        "username": process.env.PROD_DB_USR,
        "password": process.env.PROD_DB_PWD,
        "database": process.env.PROD_DB_NAME,
        "host": process.env.PROD_DB_HOST,
        "port" : process.env.PROD_DB_HOST,
        "dialect": "mysql",
        "define" : {
            "underscored" : true,
            "timestamps" : false
        }
    }
}
