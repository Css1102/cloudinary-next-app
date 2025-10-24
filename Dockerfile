# Use Node.js base image
FROM node:18

# Install ffmpeg
RUN sudo apt-get update && sudo apt-get install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
