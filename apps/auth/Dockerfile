FROM node:18

# Create app directory
WORKDIR /app
#   [from-local] [to-image]
COPY package.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# EXPOSE 7060

CMD [ "npm", "run", "start:auth" ]