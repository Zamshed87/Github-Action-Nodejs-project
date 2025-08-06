# Use official Debian-based Node.js image for better network stability
FROM node:20 as build

# Set working directory
WORKDIR /app

# Add yarn config for network retries
RUN yarn config set network-concurrency 1
RUN yarn config set network-timeout 600000

# Add node_modules/.bin to PATH for running scripts
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies (force to avoid cache issues)
RUN yarn install --force

# Update browserslist db to avoid warnings (optional)
RUN npx update-browserslist-db@latest || true

# Copy the rest of the project files
COPY . .

# Build your React app (adjust if you have different build scripts)
RUN yarn run build

# Use stable Nginx Alpine image for serving static files
FROM nginx:stable-alpine

# Copy build output to Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy your custom nginx config if needed
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
