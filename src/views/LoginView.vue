<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const stage = ref('phone') // phone | code | register
const phone = ref('')
const code = ref('')
const agreement = ref(false)
const countdown = ref(0)
const registerForm = reactive({
  phone: '',
  name: ''
})

const isAuthed = authStore.isAuthenticated

let timer = null

const canSendCode = computed(
  () => /^1\d{10}$/.test(phone.value.trim()) && agreement.value
)
const canConfirm = computed(() => code.value.trim().length === 6)
const canRegister = computed(
  () => /^1\d{10}$/.test(registerForm.phone.trim()) && registerForm.name.trim().length >= 2
)

const startCountdown = () => {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
  countdown.value = 60
  timer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      window.clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const handleSendCode = () => {
  if (!canSendCode.value) {
    ElMessage.warning('请输入手机号并同意协议')
    return
  }
  const result = authStore.requestVerifyCode(phone.value)
  if (!result.success) {
    if (result.reason === 'not_registered') {
      ElMessage.warning('手机号未注册，请先完成注册')
      registerForm.phone = phone.value
      stage.value = 'register'
    } else {
      ElMessage.error(result.message || '验证码发送失败')
    }
    return
  }
  stage.value = 'code'
  startCountdown()
  ElMessage.success(`验证码已发送（演示：${result.code}）`)
}

const handleConfirm = () => {
  if (!canConfirm.value) {
    ElMessage.warning('请输入 6 位验证码')
    return
  }
  const result = authStore.verifyCode(phone.value, code.value)
  if (!result.success) {
    ElMessage.error(result.message || '验证码校验失败')
    return
  }
  ElMessage.success('登录成功')
  router.replace('/my')
}

const handleRegister = () => {
  if (!canRegister.value) {
    ElMessage.warning('请填写完整的注册信息')
    return
  }
  const result = authStore.registerUser({
    phone: registerForm.phone,
    name: registerForm.name
  })
  if (!result.success) {
    ElMessage.warning(result.message || '注册失败')
    return
  }
  ElMessage.success('注册成功，请获取验证码登录')
  phone.value = registerForm.phone.trim()
  agreement.value = true
  stage.value = 'phone'
}

const goBack = () => {
  if (stage.value === 'code') {
    stage.value = 'phone'
    code.value = ''
  } else if (stage.value === 'register') {
    stage.value = 'phone'
  } else {
    router.back()
  }
}

const goToRegister = () => {
  registerForm.phone = phone.value || registerForm.phone
  stage.value = 'register'
}

const goToLogin = () => {
  stage.value = 'phone'
}

watch(stage, (val, oldVal) => {
  if (oldVal === 'code' && val !== 'code') {
    if (timer) {
      window.clearInterval(timer)
      timer = null
    }
    countdown.value = 0
    authStore.resetPending()
  }
})

watch(isAuthed, (val) => {
  if (val) {
    router.replace('/my')
  }
})

onMounted(() => {
  if (isAuthed.value) {
    router.replace('/my')
    return
  }
  const queryType = route.query.type
  if (queryType === 'register') {
    stage.value = 'register'
  }
  const queryPhone = route.query.phone
  if (typeof queryPhone === 'string') {
    phone.value = queryPhone
    registerForm.phone = queryPhone
  }
})

onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer)
  }
  authStore.resetPending()
})
</script>

<template>
  <div class="login-page">
    <div class="gradient-top"></div>
    <main class="login-container">
      <button class="back-btn" type="button" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <h1>验证码登录</h1>
      <div class="form-card" v-if="stage === 'phone'">
        <label>请输入手机号</label>
        <div class="input-row">
          <input v-model="phone" type="tel" maxlength="11" placeholder="请输入手机号码" />
        </div>
        <label class="agreement">
          <input v-model="agreement" type="checkbox" />
          同意
          <span>《用户协议》</span>
          和
          <span>《隐私政策》</span>
        </label>
        <button class="primary" type="button" :disabled="!canSendCode" @click="handleSendCode">
          获取验证码
        </button>
        <div class="form-footer">
          <span>还没有账号？</span>
          <button type="button" class="link-btn" @click="goToRegister">去注册</button>
        </div>
      </div>

      <div class="form-card" v-else-if="stage === 'code'">
        <label>请输入验证码</label>
        <div class="input-row code-input">
          <input v-model="code" maxlength="6" placeholder="请输入验证码" />
          <span class="countdown" v-if="countdown > 0">{{ countdown }}s</span>
          <button v-else type="button" @click="handleSendCode">重发</button>
        </div>
        <button class="primary" type="button" :disabled="!canConfirm" @click="handleConfirm">
          确认
        </button>
        <div class="form-footer">
          <span>手机号 {{ phone || '未填写' }}</span>
          <button type="button" class="link-btn" @click="stage = 'phone'">重新输入</button>
        </div>
      </div>

      <div class="form-card" v-else>
        <label>注册手机号</label>
        <div class="input-row">
          <input v-model="registerForm.phone" type="tel" maxlength="11" placeholder="请输入手机号码" />
        </div>
        <label>昵称</label>
        <div class="input-row">
          <input v-model="registerForm.name" maxlength="12" placeholder="请输入昵称（至少 2 个字符）" />
        </div>
        <button class="primary" type="button" :disabled="!canRegister" @click="handleRegister">
          提交注册
        </button>
        <div class="form-footer">
          <span>已有账号？</span>
          <button type="button" class="link-btn" @click="goToLogin">去登录</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gradient-top {
  width: 100%;
  height: 240px;
  background: linear-gradient(180deg, #a8f0d4 0%, #dff9ee 70%, #ffffff 100%);
  border-radius: 0 0 50% 50%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.login-container {
  position: relative;
  z-index: 1;
  width: min(360px, 90%);
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #204b3f;
}

.back-btn {
  border: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #204b3f;
  box-shadow: 0 12px 24px rgba(32, 75, 63, 0.18);
}

h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f4c43;
}

.form-card {
  background: #ffffff;
  border-radius: 26px;
  padding: 26px 22px;
  box-shadow: 0 20px 40px rgba(32, 75, 63, 0.14);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-card label {
  font-size: 14px;
  color: rgba(32, 75, 63, 0.8);
}

.input-row {
  display: flex;
  align-items: center;
  background: rgba(12, 159, 113, 0.12);
  border-radius: 16px;
  padding: 12px 16px;
}

.input-row input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #1f4c43;
  outline: none;
}

.agreement {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(32, 75, 63, 0.7);
}

.agreement span {
  color: #0c9f71;
}

.primary {
  border: none;
  border-radius: 18px;
  padding: 14px;
  background: linear-gradient(135deg, #0acd88 0%, #09a47a 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.primary:disabled {
  background: rgba(12, 159, 113, 0.18);
  color: rgba(31, 76, 67, 0.4);
  cursor: not-allowed;
}

.code-input {
  position: relative;
  gap: 12px;
}

.code-input button {
  border: none;
  background: rgba(12, 159, 113, 0.18);
  color: #0c9f71;
  border-radius: 12px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
}

.countdown {
  font-size: 14px;
  color: rgba(32, 75, 63, 0.7);
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(32, 75, 63, 0.7);
}

.link-btn {
  border: none;
  background: transparent;
  color: #0c9f71;
  font-weight: 600;
  cursor: pointer;
}
</style>
