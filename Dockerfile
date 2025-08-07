# Builder stage
FROM node:20-alpine as builder

WORKDIR /app

# Configure yarn for better network resilience
RUN yarn config set network-timeout 600000 -g && \
    yarn config set network-concurrency 1 -g

# Copy package files first for better caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all files
COPY . .

# Build application
RUN yarn build

# Production stage
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
