exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ?
        'mongodb://admin:password@ds157980.mlab.com:57980/final-capstone' :
        'mongodb://admin:password@ds157980.mlab.com:57980/final-capstone');

exports.PORT = 3000;