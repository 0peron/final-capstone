import 'babel-polyfill';
import express from 'express';

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

console.log(`Server running in ${process.env.NODE_ENV} mode`);

let app = express();

app.use(express.static(process.env.CLIENT_PATH));


app.get('/api/hello', function(request, response) {
    response.json({
        message: 'STEP 1: Hello From Express',
        description: 'Run the command npm start and visit localhost:PORT',
        nextStep: 'Go to the frontend and render something with a component'    
    });
});


function runServer() {
    return new Promise((resolve, reject) => {
        app.listen(PORT, HOST, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            }

            const host = HOST || 'localhost';
            console.log(`Listening on ${host}:${PORT}`);
        });
    });
}

if (require.main === module) {
    runServer();
}
