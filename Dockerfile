FROM node:18

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy TypeScript configuration and source code
COPY tsconfig.json ./
COPY src/ ./src/

# Build TypeScript files
RUN npm run build

# Expose the port your Express app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/index.js"]
