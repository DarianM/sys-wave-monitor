# Use a base image
FROM node:20.16.0-alpine3.20 AS build

# Set the working directory in the container
WORKDIR /app
# Copy the package.json and package-lock.json files
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application
COPY . .

RUN npm run build

# Serve the application using a lightweight web server
FROM nginx:alpine AS production

# Copy the dist directory from the build stage 
# to the Nginx web server’s root directory /usr/share/nginx/html)
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]