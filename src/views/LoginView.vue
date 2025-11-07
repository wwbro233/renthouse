/**
 * 登录/注册页面组件
 * 提供验证码登录和用户注册功能
 * 支持三个阶段：输入手机号、输入验证码、用户注册
 */
<script setup>
// Vue核心功能导入
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
// Element Plus消息组件
import { ElMessage } from 'element-plus'
// 路由功能
import { useRoute, useRouter } from 'vue-router'
// 用户认证状态管理
import { useAuthStore } from '../stores/authStore'

// 初始化路由实例
const router = useRouter()
// 获取当前路由信息
const route = useRoute()
// 获取用户认证store实例
const authStore = useAuthStore()

// 当前所处阶段：phone(输入手机号)、code(输入验证码)、register(注册)
const stage = ref('phone')
// 用户输入的手机号
const phone = ref('')
// 用户输入的验证码
const code = ref('')
// 是否同意用户协议
const agreement = ref(false)
// 验证码倒计时（秒）
const countdown = ref(0)
// 注册表单数据
const registerForm = reactive({
  phone: '',
  name: ''
})

// 用户认证状态
const isAuthed = authStore.isAuthenticated

// 倒计时定时器
let timer = null

/**
 * 是否可以发送验证码计算属性
 * 需要满足：手机号格式正确 && 同意用户协议
 */
const canSendCode = computed(
  () => /^1\d{10}$/.test(phone.value.trim()) && agreement.value
)

/**
 * 是否可以确认验证码计算属性
 * 需要验证码为6位数字
 */
const canConfirm = computed(() => code.value.trim().length === 6)

/**
 * 是否可以提交注册计算属性
 * 需要满足：手机号格式正确 && 昵称至少2个字符
 */
const canRegister = computed(
  () => /^1\d{10}$/.test(registerForm.phone.trim()) && registerForm.name.trim().length >= 2
)

/**
 * 开始验证码倒计时
 * 从60秒开始倒计时，到0时自动停止
 */
const startCountdown = () => {
  // 清除已存在的定时器
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
  countdown.value = 60
  // 每秒减1
  timer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      window.clearInterval(timer)
      timer = null
    }
  }, 1000)
}

/**
 * 发送验证码处理函数
 * 验证手机号后发送验证码，未注册用户引导至注册页面
 */
const handleSendCode = () => {
  // 验证是否可以发送
  if (!canSendCode.value) {
    ElMessage.warning('请输入手机号并同意协议')
    return
  }
  // 请求发送验证码
  const result = authStore.requestVerifyCode(phone.value)
  if (!result.success) {
    // 处理未注册用户
    if (result.reason === 'not_registered') {
      ElMessage.warning('手机号未注册，请先完成注册')
      registerForm.phone = phone.value
      stage.value = 'register'
    } else {
      ElMessage.error(result.message || '验证码发送失败')
    }
    return
  }
  // 切换到验证码输入阶段
  stage.value = 'code'
  startCountdown()
  ElMessage.success(`验证码已发送（演示：${result.code}）`)
}

/** * 确认验证码处理函数
 * 校验验证码并完成登录
 */
const handleConfirm = () => {
  // 验证验证码格式
  if (!canConfirm.value) {
    ElMessage.warning('请输入 6 位验证码')
    return
  }
  // 校验验证码
  const result = authStore.verifyCode(phone.value, code.value)
  if (!result.success) {
    ElMessage.error(result.message || '验证码校验失败')
    return
  }
  // 登录成功，跳转到个人中心
  ElMessage.success('登录成功')
  router.replace('/my')
}

/**
 * 提交注册处理函数
 * 验证注册信息并创建新用户
 */
const handleRegister = () => {
  // 验证注册信息
  if (!canRegister.value) {
    ElMessage.warning('请填写完整的注册信息')
    return
  }
  // 执行注册
  const result = authStore.registerUser({
    phone: registerForm.phone,
    name: registerForm.name
  })
  if (!result.success) {
    ElMessage.warning(result.message || '注册失败')
    return
  }
  // 注册成功，返回登录页面
  ElMessage.success('注册成功，请获取验证码登录')
  phone.value = registerForm.phone.trim()
  agreement.value = true
  stage.value = 'phone'
}

/**
 * 返回按钮处理函数
 * 根据当前阶段返回到上一个阶段或上一个页面
 */
const goBack = () => {
  if (stage.value === 'code') {
    // 验证码阶段返回到手机号输入阶段
    stage.value = 'phone'
    code.value = ''
  } else if (stage.value === 'register') {
    // 注册阶段返回到手机号输入阶段
    stage.value = 'phone'
  } else {
    // 手机号输入阶段返回上一页
    router.back()
  }
}

/**
 * 前往注册页面
 * 切换到注册阶段
 */
const goToRegister = () => {
  registerForm.phone = phone.value || registerForm.phone
  stage.value = 'register'
}

/**
 * 前往登录页面
 * 切换到手机号输入阶段
 */
const goToLogin = () => {
  stage.value = 'phone'
}

/**
 * 监听阶段变化
 * 离开验证码阶段时，清除倒计时定时器和待验证状态
 */
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

/**
 * 监听认证状态变化
 * 用户已登录时自动跳转到个人中心
 */
watch(isAuthed, (val) => {
  if (val) {
    router.replace('/my')
  }
})

/**
 * 组件挂载时的初始化处理
 * - 已登录用户重定向到个人中心
 * - 根据URL参数初始化页面状态
 */
onMounted(() => {
  // 已登录用户重定向
  if (isAuthed.value) {
    router.replace('/my')
    return
  }
  // 根据query参数决定初始阶段
  const queryType = route.query.type
  if (queryType === 'register') {
    stage.value = 'register'
  }
  // 从query参数获取手机号
  const queryPhone = route.query.phone
  if (typeof queryPhone === 'string') {
    phone.value = queryPhone
    registerForm.phone = queryPhone
  }
})

/**
 * 组件卸载前的清理工作
 * 清除定时器和待验证状态
 */
onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer)
  }
  authStore.resetPending()
})
</script>

<template>
  <!-- 登录页面容器 -->
  <div class="login-page">
    <!-- 顶部渐变背景 -->
    <div class="gradient-top"></div>
    <!-- 登录主容器 -->
    <main class="login-container">
      <!-- 返回按钮 -->
      <button class="back-btn" type="button" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <h1>验证码登录</h1>
      
      <!-- 阶段1：输入手机号 -->
      <div class="form-card" v-if="stage === 'phone'">
        <label>请输入手机号</label>
        <div class="input-row">
          <input v-model="phone" type="tel" maxlength="11" placeholder="请输入手机号码" />
        </div>
        <!-- 用户协议复选框 -->
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

      <!-- 阶段2：输入验证码 -->
      <div class="form-card" v-else-if="stage === 'code'">
        <label>请输入验证码</label>
        <div class="input-row code-input">
          <input v-model="code" maxlength="6" placeholder="请输入验证码" />
          <!-- 倒计时显示或重发按钮 -->
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

      <!-- 阶段3：用户注册 -->
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
