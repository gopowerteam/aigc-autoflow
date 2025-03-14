# STEP1: 构建基础镜像
FROM node:20-slim AS base
# -设置环境变量
ENV PNPM_VERSION=10.5.2

# -设置工作目录
WORKDIR /app
# -复制依赖相关目录
COPY . .

RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get install curl gcc g++ cmake ffmpeg python3 libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential libgl1-mesa-dev xvfb libxi-dev libx11-dev -y \
    && npm install -g pnpm@$PNPM_VERSION --registry=https://registry.npmmirror.com \
    && node --version \
    && pnpm --version

RUN ln -sf /usr/bin/python3 /usr/bin/python

# STEP2: 构建依赖镜像
FROM base AS build
# -安装依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# -开始构建
RUN pnpm run build

# STEP4: 运行
FROM base
COPY --from=build /app/.output /app/.output
COPY --from=build /app/node_modules /app/node_modules
RUN rm -rf .env

EXPOSE 3000
CMD [ "xvfb-run", "-s -ac -screen 0 1280x1024x24", "npm", "run", "start" ]


