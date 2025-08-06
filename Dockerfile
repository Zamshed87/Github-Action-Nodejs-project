# ======== BUILDER STAGE ========
FROM node:20-alpine as builder

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    && ln -sf python3 /usr/bin/python

WORKDIR /app

# Configure yarn
RUN yarn config set network-timeout 600000 -g && \
    yarn config set ignore-optional true -g

# Copy package files first
COPY package.json yarn.lock ./

# Clean install with frozen lockfile
RUN yarn install --frozen-lockfile --production=false --ignore-optional

# Copy remaining files
COPY . .

# Build with memory limit
RUN yarn build --max_old_space_size=4096

# ======== PRODUCTION STAGE ========
FROM nginx:stable-alpine

# Security hardening
RUN rm -rf /etc/nginx/conf.d/default.conf && \
    chown -R nginx:nginx /var/cache/nginx

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/

# Copy built assets
COPY --from=builder --chown=nginx:nginx /app/build /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
