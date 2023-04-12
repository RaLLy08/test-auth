FROM node:18

# Create app directory
WORKDIR /app
#   [from-local] [to-image]
COPY package.json .

# RUN npm ci && npm run build
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# EXPOSE 7060

RUN npm run build:auth

# RUN rm -rf apps

CMD [ "node", "dist/auth/src" ]
