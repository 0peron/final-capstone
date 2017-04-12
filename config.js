exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ?
        'mongodb://test:password1@ds157509.mlab.com:57509/movie-finder' :
        'mongodb://test:password1@ds157509.mlab.com:57509/movie-finder');
       
exports.PORT = 3000;