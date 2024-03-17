FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "index.mjs"]


# FROM node:21

# WORKDIR /app

# COPY package.json package.json
# COPY package.lock.json package.json

# COPY ./config ./config
# COPY  dest 