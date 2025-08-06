# ======== BUILD STAGE (optional) ========
FROM node:20-alpine as builder

WORKDIR /app

# Only copy what's needed for dependencies
COPY package.json yarn.lock ./

# Install deps (can be skipped if committing build files)
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy remaining files
COPY . .

# Build (omit if using pre-built assets)
RUN yarn build

# ======== PRODUCTION STAGE ========
FROM nginx:stable-alpine

# Security hardening
RUN rm -rf /etc/nginx/conf.d/default.conf && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx

# Config with cache headers
COPY nginx/nginx.conf /etc/nginx/conf.d/

# Copy from builder OR local build folder
COPY --from=builder /app/build /usr/share/nginx/html
# Alternative: COPY build /usr/share/nginx/html (if pre-built)

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
