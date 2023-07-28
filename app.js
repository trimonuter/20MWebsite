const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// CORS
app.use(cors());

// Handle fetchHTML request
app.get('/fetchHTML', async (req, res) => {
    try {
        let joinedText = "";
        for (i = 0; i < 4; i++){
            const response = await fetch(`https://myanimelist.net/topanime.php?limit=${i * 50}`);
            const text = await response.text();

            joinedText += text;
        }
    
        res.setHeader('Content-Type', 'text/plain');
        res.send(joinedText);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})