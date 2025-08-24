# Stage 1: Builder
FROM node:20-alpine as builder
WORKDIR /app

RUN yarn config set registry https://registry.npmmirror.com && \
    yarn config set network-timeout 600000 -g && \
    yarn config set network-concurrency 1 -g

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Production image
FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
