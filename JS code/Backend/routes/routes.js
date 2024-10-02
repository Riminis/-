const Router = require('express');
const pool = require('../DBconnect');
const router = new Router();

router.get('/', (req, res) => {
    res.send('Сервер работает!');
});

router.get('/roads', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roads');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/metro_stations', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM metro');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/start', async(req, res) => {
    try {
        const response = await fetch('https://nuclear-it-hack-2024-02.onrender.com');
        const data = await response.json();
        console.log(data);
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/roads', async(req, res) => {
    try {
        console.log(req.body);
        try {
            console.log("reqest");
            const response = await fetch('https://nuclear-it-hack-2024-02.onrender.com/data_metro_flow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body),
                timeout: 10000
            });
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
              }
          
              const text = await response.text();
    
              // Заменяем NaN на null
              const sanitizedText = text.replace(/NaN/g, 'null');
          
              // Парсим JSON
              const data = JSON.parse(sanitizedText);
          
              console.log('Данные:', data);
              res.send(data);
        } catch (error) {
            console.error('Ошибка при выполнении fetch:', error);
        };
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});


module.exports = router;