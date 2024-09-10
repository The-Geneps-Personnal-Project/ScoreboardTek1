# Use Node.js 18 as the base image
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, yarn.lock, and other relevant files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Serve the app with a lightweight web server
FROM nginx:alpine

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React files to the Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
