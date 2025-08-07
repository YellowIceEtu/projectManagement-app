FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

FROM nginx:alpine
COPY --from=builder /app/dist/project-management-angular/browser /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80