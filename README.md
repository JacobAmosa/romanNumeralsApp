# romanNumeralsApp
A simple web service that converts integers between 1 and 3999 into Roman numerals. This app uses an Express-based API
to process requests and returns Roman numeral values for valid inputs. This link https://www.rapidtables.com/convert/number/how-number-to-roman-numerals.html
was referenced to understand roman numeral conversion.

## Project Overview:
This project is a web service that provides an endpoint for converting integers into Roman numerals.
It provides validation for valid inputs (between 1 and 3999) and handles errors for invalid inputs.


## Technologies Used
- **Node.js:** Backend framework used for creating the API.
- **Express:** Framework used to build the web server and define routes. Chosen for its lightweight and flexible nature. Express allows rapid API development and provides easy-to-use middleware support for handling HTTP requests, making it a great choice for this simple API.
- **Prometheus:** Prometheus is a well-known tool for monitoring and gathering metrics. It is easy to set up and can be integrated with Grafana to visualize metrics, and provides insights into app performance.
- **Docker:** Docker is used to containerize the app for easier deployment and scaling. By using Docker, we can ensure the app runs consistently across different environments and isolate it from the host system.
- **Jest:** Jest is chosen for testing due to its speed, ease of setup, and built-in features like mocking, which is useful for testing API endpoints without needing to actually hit the server.
- **Adobe Spectrum React:** Adobe Spectrum React offers a wide range of customizable and accessible UI components, which helped me build a consistent and user-friendly interface. Its adherence to best practices in accessibility and performance ensured my app would be both functional and inclusive for a wide range of users.


## Build and run in Docker:
- clone the repository: `git clone git@github.com:JacobAmosa/romanNumeralsApp.git`
- `cd romanNumeralsApp`
- Add the two ENV variables using the two commands found in the email.
- Start running Docker Desktop on your machine.
- run `docker build -t roman-numerals-app .` to build the docker image.
- run `docker run -p 8080:8080 roman-numerals-app` to run the docker container.
- **Setting Up Prometheus for Monitoring:**
  - run the following command from the root directory to start up prometheus docker container.
  ```bash
    docker run -d \
    -p 9090:9090 \
    -v "$(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml" \
    prom/prometheus 
  - Access prometheus dashboard from `http://localhost:9090`.
- open the app at `http://localhost:8080`

## Build and run in Node:
- clone the repository: `git clone git@github.com:JacobAmosa/romanNumeralsApp.git`
- `cd romanNumeralsApp`
- run `npm install` to install dependencies.
- `cd frontend` and run `npm install` to install dependencies in the frontend folder.
- run `npm run build` to bundle the frontend code.
- run `npm run start` in the backend folder to run the server.
- open the app at `http://localhost:8080`

## Engineering and Testing Methodology:
- **API Design:** The app exposes a single endpoint `/romannumeral` for converting integers into Roman numerals.
  Validation is built in for inputs that are non-integer, less than 1, or greater than 3999.
- **Testing:** We use Jest to test our server routes and frontend react code. In the frontend we verify valid inputs/outputs, invalid inputs, edge cases, and correct theme modes.
 On the server end we mock the conversion logic using Jest to isolate the route logic from external dependencies. 
- **Metrics:** Prometheus metrics are exposed on `/metrics` to track request durations. This allows us to monitor the app's performance in a production environment.

## Packaging Layout
**Frontend (frontend/):** This directory contains all the React app’s source code and static assets.

**Backend (backend/):** The backend logic is stored in this directory. The main server file, server.js, is the entry point for starting the backend server.

**Root (/):** The root of my project contains the Dockerfile (creates docker image), prometheus.yml (config file for monitoring), and the package.json (dependencies used throughout the app).

**Tests (frontend/src/tests/components/ & backend/tests/):** Both folders contain test files. 


## Dependency Attribution
- Express (v4.x) 
- React (v18.x) 
- Prometheus Client (v15.x)
- Docker (v24.x) 
- Node.js (v18.x) 
- Jest (v29.x)

