📘 Project Documentation – Docker Build & Deploy with GitHub Actions & Self-Hosted Runner (ibos4)

🧾 Objective
Automate the build and deployment of a React app via Docker using GitHub Actions and a self-hosted runner (label: ibos4) on a Linux server.

            📁 Project Structure
            test-project/
            │
            ├── .github/workflows/
            │   └── docker-build-deploy.yml      ← GitHub Actions workflow
            ├── nginx/
            │   └── nginx.conf                   ← Custom Nginx config
            ├── Dockerfile                       ← Multi-stage Dockerfile (React + Nginx)
            ├── docker-compose.yml              ← (Optional, unused)
            ├── actions-runner/                 ← GitHub self-hosted runner (git-ignored)
            ├── package.json, yarn.lock         ← React dependencies
            ├── public/, src/, ...              ← React source code
            └── ...


🚀 Deployment Overview
            Item
            Description
            App Framework
            React + Nginx (via multi-stage Docker)
            CI/CD Tool
            GitHub Actions
            Runner
            Self-hosted on label ibos4
            Deployment Port
            Host 8080 → Container 80
            Final URL
            http://<your-server-ip>:8080


🔁 GitHub Actions Workflow
📄 Path: .github/workflows/docker-build-deploy.yml

      name: Docker Build & Deploy
      
      on:
        push:
          branches: [main]
        workflow_dispatch:
      
      env:
        DOCKER_IMAGE_NAME: test-project
        CONTAINER_NAME: test-project-container
        HOST_PORT: 8080
        CONTAINER_PORT: 80
      
      jobs:
        build:
          name: Build Docker Image
          runs-on: [self-hosted, ibos4]
      
          steps:
            - name: Checkout code
              uses: actions/checkout@v4
      
            - name: Build Docker image
              run: |
                docker build \
                  --network=host \
                  -t ${{ env.DOCKER_IMAGE_NAME }}:${{ github.sha }} \
                  -t ${{ env.DOCKER_IMAGE_NAME }}:latest .
      
        deploy:
          name: Deploy Application
          runs-on: [self-hosted, ibos4]
          needs: build
      
          steps:
            - name: Stop and remove existing container (if any)
              run: |
                if [ $(docker ps -q -f name=${{ env.CONTAINER_NAME }}) ]; then
                  docker stop ${{ env.CONTAINER_NAME }}
                  docker rm ${{ env.CONTAINER_NAME }}
                fi
      
            - name: Run container with docker run
              run: |
                docker run -d --name ${{ env.CONTAINER_NAME }} \
                  -p ${{ env.HOST_PORT }}:${{ env.CONTAINER_PORT }} \
                  ${{ env.DOCKER_IMAGE_NAME }}:latest
      
      


🧱 Dockerfile
📄 Path: Dockerfile

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





🏗️ Self-Hosted Runner Setup (ibos4)
1. 🔄 Remove Existing Runner (if needed)

            cd ~/github-action/test-project/actions-runner
            ./svc.sh stop || ./run.sh --stop
            ./config.sh remove --unattended
            sudo chown -R $USER:$USER ~/github-action/test-project/actions-runner
            sudo rm -rf ~/github-action/test-project/actions-runner


2. 🧰 Install New Runner
1. Create Runner Directory & Download Package

            mkdir -p ~/github-action/test-project/actions-runner && cd ~/github-action/test-project/actions-runner
            
            curl -o actions-runner-linux-x64-2.327.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.327.1/actions-runner-linux-x64-2.327.1.tar.gz
            
            echo "d68ac1f500b747d1271d9e52661c408d56cffd226974f68b7dc813e30b9e0575  actions-runner-linux-x64-2.327.1.tar.gz" | shasum -a 256 -c

            tar xzf actions-runner-linux-x64-2.327.1.tar.gz



2. Set Ownership (if needed) && Configure the Runner
 (as user ibos, without sudo)
Make sure your user (e.g., ibos) owns the directory:
            chown -R ibos:ibos /home/ibos/github-action/test-project/actions-runner/
            
            su - ibos
            
            cd /home/ibos/github-action/test-project/actions-runner/
            
            ./config.sh --url https://github.com/Zamshed87/Github-Action-Nodejs-project --token APKW6DI3VOSO6K64XB2C4QLISSBOG --name ibos4 --labels ibos4




4. 🚀 Run the Runner
Option A – Foreground:
            
            ./run.sh

Option B – Run as Service (Recommended):
            
            sudo ./svc.sh install
            sudo ./svc.sh start
            sudo ./svc.sh status


5. 🧹 Ignore Runner Directory in Git

            echo "actions-runner/" >> .gitignore
            git rm -r --cached actions-runner/
            git commit -m "Ignore actions-runner binaries"
            git push



🌐 Output & Accessing the App





Visit your app at:  http://10.209.99.209:8080

Make sure port 8080 is open in your server firewall.

🧹 Docker Maintenance Commands 
Stop container
            docker stop test-project-container
Remove container
            docker rm test-project-container
View running containers
            docker ps
Remove image
            docker rmi -f <IMAGE_ID>


            ✅ Final Checklist
            ✅ Item
            Status
            GitHub Actions Workflow
            ✅ Present and configured
            Dockerfile
            ✅ Multi-stage React → Nginx
            Port Mapping
            ✅ 8080 → 80
            Runner Installed
            ✅ Labeled ibos4
            Runner Running
            ✅ As service
            Workflow Target
            ✅ runs-on: [self-hosted, ibos4]
            Git Ignore Runner Directory
            ✅ actions-runner/ ignored










Nginx documentation


root@ibos:/home/ibos/github-action/test-project# cat /etc/nginx/sites-available/default

                        server {
                            listen 80;
                            server_name 10.209.99.209;
                        
                            # Redirect all HTTP to HTTPS
                            return 301 https://$host$request_uri;
                        }
                        
                        server {
                            listen 443 ssl;
                            server_name 10.209.99.209;
                        
                            ssl_certificate /home/ibos/cert.pem;
                            ssl_certificate_key /home/ibos/key.pem;
                        
                            ssl_protocols TLSv1.2 TLSv1.3;
                            ssl_ciphers HIGH:!aNULL:!MD5;
                        
                            location / {
                                proxy_pass http://127.0.0.1:8080;
                                proxy_http_version 1.1;
                                proxy_set_header Upgrade $http_upgrade;
                                proxy_set_header Connection "upgrade";
                                proxy_set_header Host $host;
                                proxy_cache_bypass $http_upgrade;
                            }
                        }
