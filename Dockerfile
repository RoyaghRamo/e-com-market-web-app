# Base image
FROM node:18.16.0-bullseye-slim AS base
WORKDIR /app

# Install dependencies
FROM base AS dependencies
COPY package*.json ./
RUN npm install --production
RUN npm install -g npm@^9.6.5
RUN npm install -g @angular/cli@^15.2.7
RUN npm cache clean --force

# Build app
FROM dependencies AS build
COPY . .
RUN npm run build --prod

# Production image
FROM nginx:1.24.0-alpine AS production
COPY --from=build /app/dist/e-com-market-web-app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
