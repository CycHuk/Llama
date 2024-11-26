FROM node:20 AS frontend-builder

WORKDIR /app/frontend

COPY ./frontend/ .

RUN npm install
RUN npm run build

RUN ls -la ./build

FROM node:20 AS backend

WORKDIR /app

COPY --from=frontend-builder /app/frontend/build ./backend/build

COPY ./backend/ ./backend

WORKDIR /app/backend
RUN npm install

RUN ls -la .

CMD ["npm", "run", "dev"]
