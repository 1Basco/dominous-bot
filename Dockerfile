FROM oven/bun

WORKDIR /app

ADD package*.json bun.lockb ./
RUN bun install
ADD src/ ./src/
ADD bun.lockb bun.lockb

CMD [ "bun", "run", "start" ]