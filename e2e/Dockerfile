FROM cypress/included:13.6.2

WORKDIR /e2e

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "cypress:run"]
