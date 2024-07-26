# Simalar from Frontend Module
FROM node:20


# Standard Express Js building block
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

#Default the backend to 3000

# Start the node.js server https://docs.licensegate.io/self-hosting/#backend
CMD npm run start