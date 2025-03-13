# STEP1: 构建基础镜像
FROM alpine:3.20 as base
# -设置环境变量
ENV NODE_VERSION=20.18.3
ENV PNPM_VERSION=10.5.2

# -设置工作目录
WORKDIR /app
# -复制依赖相关目录
COPY . .
# 安装基础包
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
#     && apk add --no-cache nodejs npm python3 curl gcc g++ make linux-headers \
#     && npm install -g pnpm@$PNPM_VERSION --registry=https://registry.npmmirror.com \
RUN apk add --no-cache nodejs npm curl gcc g++ make linux-headers pkgconfig \
    && npm install -g pnpm@$PNPM_VERSION \
    && node --version \
    && pnpm --version

RUN apk add --no-cache python3 python3-pip --repository=http://dl-cdn.alpinelinux.org/alpine/v3.19/main
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# STEP2: 构建依赖镜像
FROM base as build
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
CMD [ "npm", "run", "start" ]


