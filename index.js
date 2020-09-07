const { PORT } = require('./config');
const cors = require('cors');
const express = require('express');
const connectDB = require('./db/index');
const app = express();
const routes = require('./routes');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

async function initApp() {
    try {
        connectDB();
        app.listen(PORT, () => {
            console.log(`server on ${PORT}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(0);
    };
};

initApp();


