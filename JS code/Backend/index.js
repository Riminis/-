const express = require('express');
const UserRouter = require('./routes/routes');
const pool = require('./DBconnect');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/', UserRouter);
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});