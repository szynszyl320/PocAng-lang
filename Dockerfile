FROM node:alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build 

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/installed/browser /usr/share/nginx/html

CMD ["/bin/sh", "-c", "echo \"{\\\"API_URL\\\": \\\"$API_URL\\\"}\" > /usr/share/nginx/html/assets/runtime.json && nginx -g \"daemon off;\""]