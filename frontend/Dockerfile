# Use this image as the platform to build the web
FROM node:20-alpine AS dockerbuild

# A small line inside the image to show who made it
LABEL Developers="Curlybytes,DevLeoko"

# Set Environment values to use during build
ENV PUBLIC_BACKEND_URL=${PUBLIC_BACKEND_URL}
ENV PUBLIC_RECAPTCHA_SITE_KEY=${PUBLIC_RECAPTCHA_SITE_KEY}
ENV PUBLIC_GOOGLE_AUTH_CLIENT_ID=${PUBLIC_GOOGLE_AUTH_CLIENT_ID}

# https://docs.licensegate.io/self-hosting/#frontend
# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy all local files into the image
COPY . .

# Generate .env file to be used during build
RUN sh -c 'printenv | grep "^PUBLIC_" > .env'

RUN npm run build

# Add nginx for static frontend https://docs.licensegate.io/self-hosting/#serving-the-files-with-nginx
FROM nginx:1.19-alpine

#Copy the Build folder only https://docs.licensegate.io/self-hosting/#frontend
COPY --from=dockerbuild /app/build /usr/share/nginx/html

# move the nginx.conf file to the configurations of nginx to load them correctly.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 5000 since this is now from nginx(80 or 443)
EXPOSE 5000

# Default command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
