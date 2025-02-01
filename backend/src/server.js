const express = require('express');
const cors = require('cors');
const path = require('path');
const convertToRoman = require('../src/utils/romanNumerals');
const winston = require('winston');
const prometheus = require('prom-client');

// setting up winston logging configurations.
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

// Creating a new registry for metrics.
const register = new prometheus.Registry();
// Defining histogram metric to track http request duration
const httpRequestDurationMicroseconds = new prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Histogram of HTTP request durations in seconds',
    buckets: [0.1, 0.2, 0.5, 1, 2, 5], // Define the buckets(time ranges)
});
register.registerMetric(httpRequestDurationMicroseconds);

const port = 8080;
const app = express();
app.use(cors());
app.use(express.json());

// Log the duration of each HTTP request.
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;  // Convert to seconds
        httpRequestDurationMicroseconds.observe(duration);  // Record the duration in the histogram
    });
    next();
});

// Serving static files from the build folder in the frontend.
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Endpoint for Prometheus to scrape and collect metric data.
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Converts an integer (between 1 and 3999) into its Roman numeral equivalent.
app.get('/romannumeral', (req, res) => {
    const { query } = req.query;
    const inputNumber = parseInt(query, 10);

    // Return an error for invalid input (non number or outside the specified number range).
    if (isNaN(inputNumber) || inputNumber <= 0 || inputNumber > 3999) {
        logger.error('Invalid input provided');
        return res.status(400).send('Invalid input. Please provide an integer between 1 and 3999.');
    }

    // perform the roman numeral conversion.
    const romanNumeral = convertToRoman(inputNumber);
    logger.info(`Converted ${inputNumber} to ${romanNumeral}`);

    res.json({
        input: inputNumber.toString(),
        output: romanNumeral,
    });
});

// Directs all unmatched routes to the index.html file of the frontend.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

// Starts the Express server on port 8080.
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});