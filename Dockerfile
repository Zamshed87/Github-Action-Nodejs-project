# Stage 1: Builder
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Use faster registry and conservative network settings
RUN yarn config set registry https://registry.npmmirror.com && \
    yarn config set network-timeout 600000 -g && \
    yarn config set network-concurrency 1 -g

# Copy only lock and manifest to install dependencies and enable Docker caching
COPY package.json yarn.lock ./

# Install dependencies (cached unless package.json/yarn.lock changes)
RUN yarn install --frozen-lockfile

# Copy the rest of your code
COPY . .

# Build your app
RUN yarn build

# Stage 2: Production image
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d

# Copy built React app from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
