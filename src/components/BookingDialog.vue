<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useBookingStore } from '../stores/bookingStore'

const bookingStore = useBookingStore()
const state = computed(() => bookingStore.state)

const formRef = ref()
const formModel = reactive({
  propertyId: '',
  title: '',
  address: '',
  contactName: '',
  contactPhone: '',
  date: '',
  timeSlot: '',
  remark: ''
})

const rules = {
  contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入 11 位手机号', trigger: 'blur' }
  ],
  date: [{ required: true, message: '请选择看房日期', trigger: 'change' }],
  timeSlot: [{ required: true, message: '请选择看房时间段', trigger: 'change' }]
}

const timeOptions = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '18:00 - 20:00'
]

watch(
  () => state.value.preset,
  (preset) => {
    if (!preset) return
    formModel.propertyId = preset.propertyId || ''
    formModel.title = preset.title || '自由选择房源'
    formModel.address = preset.address || ''
    formModel.contactName = preset.contactName || ''
    formModel.contactPhone = preset.contactPhone || ''
    formModel.date = ''
    formModel.timeSlot = ''
    formModel.remark = ''
  },
  { immediate: true }
)

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    bookingStore.addBooking({
      title: formModel.title,
      address: formModel.address,
      contactName: formModel.contactName,
      contactPhone: formModel.contactPhone,
      time: `${formModel.date} ${formModel.timeSlot}`,
      remark: formModel.remark,
      type: '约看'
    })
    ElMessage.success('预约提交成功，客服将尽快与您确认')
  })
}

const handleClose = () => {
  bookingStore.closeBookingDialog()
}
</script>

<template>
  <el-dialog
    :model-value="state.dialogVisible"
    class="booking-dialog"
    width="480px"
    destroy-on-close
    @close="handleClose"
  >
    <template #header>
      <div class="dialog-header">
        <h3>预约看房</h3>
        <p>填写联系信息，置业顾问会在 10 分钟内联系你确认行程</p>
      </div>
    </template>

    <div class="booking-summary" v-if="formModel.title">
      <p class="summary-title">{{ formModel.title }}</p>
      <p class="summary-address" v-if="formModel.address">{{ formModel.address }}</p>
    </div>

    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="96px">
      <el-form-item label="房源名称">
        <el-input v-model="formModel.title" placeholder="请输入房源或小区名称" />
      </el-form-item>
      <el-form-item label="看房地址">
        <el-input v-model="formModel.address" placeholder="楼盘或看房集合地点" />
      </el-form-item>
      <el-form-item label="看房日期" prop="date">
        <el-date-picker
          v-model="formModel.date"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled-date="(time) => time.getTime() < Date.now() - 86400000"
        />

        
      </el-form-item>
      <el-form-item label="时间段" prop="timeSlot">
        <el-select v-model="formModel.timeSlot" placeholder="选择看房时间">
          <el-option
            v-for="item in timeOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input v-model="formModel.contactName" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="formModel.contactPhone" placeholder="手机号码" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="formModel.remark"
          type="textarea"
          :rows="3"
          placeholder="可填写通勤诉求或备注信息"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交预约</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-header h3 {
  margin: 0;
  font-size: 20px;
  color: var(--gray-1);
}

.dialog-header p {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--gray-3);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.booking-summary {
  padding: 14px 16px;
  border-radius: var(--border-radius-md);
  background: var(--brand-primary-soft);
  border: 1px solid rgba(29, 198, 140, 0.2);
  margin-bottom: 20px;
}

.summary-title {
  margin: 0;
  font-weight: 600;
  color: var(--brand-primary);
}

.summary-address {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--gray-3);
}
</style>
