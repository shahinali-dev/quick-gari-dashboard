# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build-time args
ARG VITE_API_URL

# Export as ENV so Vite can read
ENV VITE_API_URL=$VITE_API_URL

# Build Vite app
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]