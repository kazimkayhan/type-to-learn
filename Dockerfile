FROM node:26 AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine
COPY ./public/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /app
