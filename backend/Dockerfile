# Use official Node.js image (lightweight Alpine version)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./
RUN npm install

# ✅ Install nodemon globally
RUN npm install -g nodemon

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your backend runs on
EXPOSE 5000
CMD ["nodemon", "server.js"]

# Start the server
CMD ["npm", "run", "dev"]
