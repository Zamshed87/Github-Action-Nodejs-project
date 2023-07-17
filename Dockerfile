# # Docker Image which is used as foundation to create
# # a custom Docker Image with this Dockerfile
# FROM node:12
 
# # A directory within the virtualized Docker environment
# # Becomes more relevant when using Docker Compose later
# WORKDIR /usr/src/app
 
# # Copies package.json and package-lock.json to Docker environment
# COPY package*.json ./
 
# # Installs all node packages
# RUN npm install
 
# # Copies everything over to Docker environment
# COPY . .
 
# # Uses port which is used by the actual application
# EXPOSE 3000
 
# # Finally runs the application
# CMD [ "npm", "start" ]





FROM node:16-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
# COPY package-lock.json ./
COPY yarn.lock ./
#RUN npm ci --silent
# RUN npm install 
RUN yarn install --force
#react-scripts@3.4.1 -g --silent
COPY . ./
# RUN npm run build
RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80



CMD ["nginx", "-g", "daemon off;"]