const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;


app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/romannumeral', (req, res) => {
    const { query } = req.query; // Extract query parameter
    const inputNumber = parseInt(query, 10);

    if (isNaN(inputNumber) || inputNumber <= 0 || inputNumber > 3999) {
        return res.status(400).send('Invalid input. Please provide an integer between 1 and 3999.');
    }

    const romanNumeral = convertToRoman(inputNumber);

    res.json({
        input: inputNumber.toString(),
        output: romanNumeral,
    });
});

const convertToRoman = (num) => {
    const romanValues = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ];

    let result = '';

    for (const pair of romanValues) {
        while (num >= pair.value) {
            result += pair.numeral;
            num -= pair.value;
        }
    }

    return result;
};

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});