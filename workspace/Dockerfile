# Use a Node.js 20 base image, which aligns with the project's environment.
FROM node:20-bookworm-slim

# Install system libraries required by node-canvas.
# build-essential: Provides tools like 'make' for compiling native addons.
# libcairo2-dev, libpango1.0-dev, libjpeg-dev, libgif-dev, librsvg2-dev: Graphics libraries for canvas.
# pkg-config: Helps node-gyp find the installed system libraries.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory for the application.
WORKDIR /app

# Copy package definition files to leverage Docker's layer caching.
# This way, dependencies are only re-installed if these files change.
COPY package*.json ./

# Install project dependencies using 'npm ci' for a clean, reproducible install.
RUN npm ci

# Copy the rest of the application source code into the container.
COPY . .

# Build the Next.js application for production.
RUN npm run build

# The command to start the application when the container launches.
# App Hosting will automatically set the PORT environment variable.
CMD ["npm", "start"]
