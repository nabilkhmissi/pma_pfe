FROM node as build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/main /usr/share/nginx/html
EXPOSE 80