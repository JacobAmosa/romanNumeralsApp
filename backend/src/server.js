const express = require('express');
const cors = require('cors');
const path = require('path');
const convertToRoman = require('../src/utils/romanNumerals');
const winston = require('winston');
const prometheus = require('prom-client');


const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

// Creating a new registry for metrics
const register = new prometheus.Registry();

// Defining a metric for HTTP request durations
const httpRequestDurationMicroseconds = new prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Histogram of HTTP request durations in seconds',
    buckets: [0.1, 0.2, 0.5, 1, 2, 5], // Define the buckets (time ranges) for the histogram
});
register.registerMetric(httpRequestDurationMicroseconds);

const port = 8080;
const app = express();
app.use(cors());
app.use(express.json());

// Log request durations
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;  // Convert to seconds
        httpRequestDurationMicroseconds.observe(duration);  // Record the duration in the histogram
    });
    next();
});

app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.get('/romannumeral', (req, res) => {
    const { query } = req.query;
    const inputNumber = parseInt(query, 10);

    if (isNaN(inputNumber) || inputNumber <= 0 || inputNumber > 3999) {
        logger.error('Invalid input provided');
        return res.status(400).send('Invalid input. Please provide an integer between 1 and 3999.');
    }

    const romanNumeral = convertToRoman(inputNumber);
    logger.info(`Converted ${inputNumber} to ${romanNumeral}`);

    res.json({
        input: inputNumber.toString(),
        output: romanNumeral,
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});