# Use the official Node.js image as the base image
FROM node

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY yarn.lock ./

# Install application dependencies
RUN npm install

# Copy the application code to the container
COPY src/app.js app.js

# Expose ports 80, 7007, and 11011
EXPOSE 80
EXPOSE 7007
EXPOSE 11011

# Start the Node.js application
CMD [ "node", "app.js" ]