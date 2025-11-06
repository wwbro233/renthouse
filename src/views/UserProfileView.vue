<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { assetUrl } from '../utils/assets'

const router = useRouter()
const authStore = useAuthStore()

const profileFormRef = ref()
const profileForm = reactive({
  avatar: assetUrl('avatars/avatar-default.jpg'),
  name: '',
  nickname: '',
  gender: '',
  birthday: '',
  phone: '',
  email: '',
  signature: '',
  password: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  nickname: [{ required: false, message: '请输入昵称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
  ],
  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
  ],
  password: [{ min: 6, message: '密码至少 6 位', trigger: 'blur' }]
}

// 加载用户数据
const loadUserData = () => {
  const user = authStore.currentUser.value
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  profileForm.avatar = user.avatar || assetUrl('avatars/avatar-default.jpg')
  profileForm.name = user.name || ''
  profileForm.nickname = user.nickname || ''
  profileForm.gender = user.gender || ''
  profileForm.birthday = user.birthday || ''
  profileForm.phone = user.phone || ''
  profileForm.email = user.email || ''
  profileForm.signature = user.signature || ''
  profileForm.password = '' // 不显示密码
}

const handleAvatarChange = (uploadFile) => {
  const reader = new FileReader()
  reader.onload = () => {
    profileForm.avatar = reader.result
  }
  reader.readAsDataURL(uploadFile.raw)
}

const handleSubmit = async () => {
  const valid = await profileFormRef.value?.validate().catch(() => false)
  if (!valid) {
    ElMessage.warning('请填写正确的信息')
    return
  }
  
  // 准备更新数据
  const updates = {
    name: profileForm.name,
    nickname: profileForm.nickname,
    avatar: profileForm.avatar,
    gender: profileForm.gender,
    birthday: profileForm.birthday,
    email: profileForm.email,
    signature: profileForm.signature
  }
  
  // 如果填写了密码，则更新密码
  if (profileForm.password && profileForm.password.length >= 6) {
    updates.password = profileForm.password
  }
  
  const result = authStore.updateUserProfile(updates)
  
  if (result.success) {
    ElMessage.success('资料更新成功')
    // 清空密码字段
    profileForm.password = ''
    // 可以选择跳转回我的页面
    setTimeout(() => {
      router.push('/my')
    }, 1500)
  } else {
    ElMessage.error(result.message || '更新失败')
  }
}

const handleReset = () => {
  loadUserData()
  ElMessage.info('已重置为原始数据')
}

const handleCancel = () => {
  router.push('/my')
}

onMounted(() => {
  loadUserData()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-title">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/my">我的</el-breadcrumb-item>
          <el-breadcrumb-item>个人资料</el-breadcrumb-item>
        </el-breadcrumb>
        <h2>完善个人资料</h2>
      </div>
      <el-button type="primary" plain @click="handleReset">重置</el-button>
    </div>

    <div class="section-card">
      <el-form
        ref="profileFormRef"
        :model="profileForm"
        :rules="rules"
        label-width="120px"
        class="profile-form"
      >
        <el-form-item label="头像">
          <div class="avatar-uploader">
            <el-avatar :size="104" :src="profileForm.avatar" />
            <el-upload
              class="upload"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              accept="image/png,image/jpeg"
              @change="handleAvatarChange"
            >
              <el-button type="primary" plain>更换头像</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="profileForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="profileForm.nickname" placeholder="请输入昵称（选填）" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="profileForm.gender">
            <el-radio-button label="male">男</el-radio-button>
            <el-radio-button label="female">女</el-radio-button>
            <el-radio-button label="secret">保密</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="profileForm.birthday"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱（选填）" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="profileForm.signature" type="textarea" rows="3" placeholder="介绍一下自己吧（选填）" />
        </el-form-item>
        <el-form-item label="修改密码" prop="password">
          <el-input v-model="profileForm.password" type="password" show-password placeholder="如需修改密码请输入（至少6位）" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" @click="handleSubmit">保存修改</el-button>
          <el-button size="large" plain @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-form {
  max-width: 720px;
}

.avatar-uploader {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload :deep(.el-upload) {
  display: inline-flex;
}

@media (max-width: 767px) {
  .profile-form {
    max-width: 100%;
  }

  .avatar-uploader {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
