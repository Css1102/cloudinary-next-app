# Stage 1: Build
FROM node:18 AS builder

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

COPY .env .env

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Stage 2: Production
FROM node:18

# Install ffmpeg again for runtime
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app .

# Install only production dependencies
RUN npm install --omit=dev

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
