const request = require('supertest');
const express = require('express');
const cors = require('cors');
const path = require('path');
const convertToRoman = require('../src/utils/romanNumerals');

jest.mock('../src/utils/romanNumerals');

const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/romannumeral', (req, res) => {
    const { query } = req.query;
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

describe('Server Tests', () => {
    it('should respond with status 200 on the /romannumeral endpoint for valid input', async () => {
        convertToRoman.mockReturnValue('X');
        const response = await request(app)
            .get('/romannumeral?query=10')
            .expect(200);

        expect(response.body).toHaveProperty('input', '10');
        expect(response.body).toHaveProperty('output', 'X');
    });

    it('should return status 400 for invalid input (non-integer)', async () => {
        const response = await request(app)
            .get('/romannumeral?query=not-a-number')
            .expect(400);

        expect(response.text).toBe('Invalid input. Please provide an integer between 1 and 3999.');
    });

    it('should return status 400 for invalid input (number less than 1)', async () => {
        const response = await request(app)
            .get('/romannumeral?query=-1')
            .expect(400);

        expect(response.text).toBe('Invalid input. Please provide an integer between 1 and 3999.');
    });

    it('should return status 400 for invalid input (number greater than 3999)', async () => {
        const response = await request(app)
            .get('/romannumeral?query=4000')
            .expect(400);

        expect(response.text).toBe('Invalid input. Please provide an integer between 1 and 3999.');
    });

    it('should return status 404 for an invalid route', async () => {
        const response = await request(app)
            .get('/invalidroute')
            .expect(404);

        expect(response.text).toContain('Not Found');
    });
});
