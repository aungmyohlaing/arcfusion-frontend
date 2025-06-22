# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5173 (default Vite dev server port)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"] 