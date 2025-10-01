# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker layer caching
# This speeds up subsequent builds if only source code changes
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on (matching server.js PORT 5000)
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
