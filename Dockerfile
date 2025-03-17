# STEP1: 构建基础镜像
FROM rockylinux/rockylinux:9.5.20241118 AS base
# -设置环境变量
ENV PNPM_VERSION=10.5.2

# -设置工作目录
WORKDIR /app
# -复制依赖相关目录
COPY . .

# support utf-8
RUN dnf install -y langpacks-en glibc-langpack-en
ENV LANG="en_US.UTF-8"

RUN dnf module install -y nodejs:20/minimal
RUN dnf install -y git
RUN dnf install -y gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib
RUN dnf install -y mesa-dri-drivers Xvfb libXi-devel libXinerama-devel libX11-devel
RUN npm install -g pm2 pnpm@$PNPM_VERSION

# RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list.d/debian.sources \
#     && apt-get update \
#     && apt-get install curl gcc g++ cmake ffmpeg python3 libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential libgl1-mesa-dev xvfb libxi-dev libxinerama-dev libx11-dev -y \
#     && npm install -g pm2 pnpm@$PNPM_VERSION --registry=https://registry.npmmirror.com \
#     && node --version \
#     && pnpm --version

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

ENTRYPOINT ["pm2-runtime", "start", "process.json"]
EXPOSE 3000


