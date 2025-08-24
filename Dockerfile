# Stage 1: Builder
FROM node:20-alpine as builder

WORKDIR /app

# Use faster registry, reasonable network concurrency
RUN yarn config set registry https://registry.npmmirror.com && \
    yarn config set network-timeout 300000 -g && \
    yarn config set network-concurrency 8 -g

# Copy lock & manifest first
COPY package.json yarn.lock ./

# Install dependencies with cache folder and ignore engine/peer warnings
RUN yarn install --frozen-lockfile --ignore-engines --cache-folder /app/.yarn-cache

# Copy the rest of the code
COPY . .

# Build app
RUN yarn build

# Stage 2: Production
FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
