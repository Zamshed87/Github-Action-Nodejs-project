# Builder stage
FROM node:20-alpine as builder

WORKDIR /app

# Set Yarn config and install dependencies
COPY package.json yarn.lock ./
RUN yarn config set network-timeout 600000 -g && \
    yarn config set network-concurrency 1 -g && \
    yarn install --frozen-lockfile

# Copy all project files and build
COPY . .
RUN yarn build

# Production stage
FROM nginx:stable-alpine

# Clean default config and add custom
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# Copy build output from previous stage
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
