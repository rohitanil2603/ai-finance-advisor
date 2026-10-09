# Bonus: production image for the backend. Implement once package.json exists.
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["node", "dist/index.js"]
