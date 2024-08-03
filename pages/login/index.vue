<script setup lang="ts">
import type { FieldRule } from '@arco-design/web-vue'

const user = useUserStore()
const loginModel = $ref({
  username: '',
  password: '',
})

const loginRules: Record<string, FieldRule[]> = {
  username: [
    {
      required: true,
      message: '请输入用户名',
    },
    {
      min: 4,
      max: 12,
      message: '用户名格式错误',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
    {
      min: 6,
      max: 12,
      message: '密码格式错误',
    },
  ],
}

async function onLogin() {
  try {
    const { accessToken, refreshToken, expires } = await $request('/api/auth/login', {
      method: 'POST',
      body: loginModel,
    })

    user.updateToken({
      accessToken,
      refreshToken,
      expires,
    })

    navigateTo('/', { replace: true, open: { target: '_self' } })
  }
  catch {
    // Message.error('登录失败')
  }
}
</script>

<template>
  <div class="login-page absolute inset-0 flex">
    <div v-if="$viewport.match('desktop')" class="flex-1" />
    <div class="flex-center flex-1">
      <div class="login-card desktop:w-[400px] mobile:w-[80%] space-y-10">
        <div class="space-y-2">
          <div class="title text-2xl font-bold">
            AIGC AutoFlow
          </div>
        </div>

        <div class="login-form">
          <AForm
            auto-label-width
            :label-col-props="{ span: 0 }"
            :model="loginModel"
            :rules="loginRules"
            @submit-success="onLogin"
          >
            <AFormItem prop="username">
              <AInput v-model="loginModel.username" placeholder="请输入用户名" size="large">
                <template #prepend>
                  用户名
                </template>
              </AInput>
            </AFormItem>
            <AFormItem prop="password">
              <AInput
                v-model="loginModel.password"
                :input-attrs="{ autocomplete: true }"
                placeholder="请输入密码"
                size="large"
                type="password"
              >
                <template #prepend>
                  密码
                </template>
              </AInput>
            </AFormItem>
            <AFormItem>
              <AButton
                html-type="submit"
                long
                size="large"
                type="primary"
              >
                登录
              </AButton>
            </AFormItem>
          </AForm>
        </div>
      </div>
    </div>
  </div>
  <div class="background">
    <div v-for="_ in 4" :key="_" class="wave" />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';

.login-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}

.login-form :deep(.arco-input-prepend) {
  color: var(--text-color-primary);
  min-width: 5em;
  font-size: 0.8rem;
  font-weight: bolder;
}

.background {
  position: absolute;
  inset: 0;
  z-index: -1;
  align-items: center;
  min-height: 100vh;
  background-color: fff;
  overflow: hidden;

  .wave {
    content: '';
    position: absolute;
    left: 50%;
    min-width: 300vw;
    min-height: 300vw;
    background: linear-gradient(
      60deg,
      rgba(84, 58, 183, 1) 0%,
      rgba(0, 172, 193, 1) 100%
    );
    animation: rotate 15s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;

    @for $i from 1 to 5 {
      &:nth-child(#{$i}) {
        bottom: calc(15vh + #{$i * 5}px);
        opacity: calc(0.9 - #{$i * 0.1});
        animation-delay: #{-2 * $i}s;
        border-radius: #{calc(45 - $i * 0.5) + '%'};
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: translate3d(-50%, 0, 0) rotateZ(0deg);
  }

  50% {
    transform: translate3d(-50%, -2%, 0) rotateZ(180deg);
  }

  100% {
    transform: translate3d(-50%, 0%, 0) rotateZ(360deg);
  }
}
</style>
