FROM node:20-alpine as build

# Install dependencies needed for native modules like canvas
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  libc6-compat \
  cairo-dev \
  pango-dev \
  jpeg-dev \
  giflib-dev \
  pixman-dev \
  libjpeg-turbo-dev \
  && ln -sf python3 /usr/bin/python

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./ 
COPY yarn.lock ./

RUN yarn install --force

# Optional but helps avoid warnings about outdated caniuse-lite
RUN npx update-browserslist-db@latest || true

COPY . ./

RUN yarn run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
