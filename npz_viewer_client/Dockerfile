# Use official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the Next.js app files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the Next.js code
COPY . .

# Build the Next.js app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]

