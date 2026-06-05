# --- Stage 1: Build ---
# Use the current Node 22 Image (LTS)
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy only the package files first (for better Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the project code
COPY . .

# Set CI Environment Variable so Vitest doesn't run in Watch-Mode
ENV CI=true

# Run linter
RUN npm run lint

# Run tests
RUN npm test -- run

# Build the app for production (creates the /dist folder)
RUN npm run build

# --- Stage 2: Serve ---
# Use a lightweight Nginx server for delivery
FROM nginx:alpine

# Copy the built files from Stage 1 into the Nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]