# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 8080
EXPOSE 8080

# Command to run the app
CMD ["node", "backend/src/server.js"]
