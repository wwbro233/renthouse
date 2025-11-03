<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { myShareList } from '../data/mockData'

const filters = reactive({
  keyword: '',
  status: '',
  type: ''
})

const tableData = ref(myShareList.map((item) => ({ ...item })))

watch([() => filters.keyword, () => filters.status, () => filters.type], () => {
  // no pagination
})

const filteredData = computed(() => {
  let result = [...tableData.value]
  if (filters.keyword) {
    result = result.filter((item) =>
      item.title.toLowerCase().includes(filters.keyword.toLowerCase())
    )
  }
  if (filters.status) {
    result = result.filter((item) => item.status === filters.status)
  }
  if (filters.type) {
    result = result.filter((item) => item.shareType === filters.type)
  }
  return result
})

const handlePublish = () => {
  ElMessage.info('发布拼租功能即将上线')
}

const handleView = (row) => {
  ElMessage.info(`查看「${row.title}」详情入口开发中`)
}

const handleEdit = (row) => {
  ElMessage.info(`编辑「${row.title}」功能即将上线`)
}

const handleCancel = (row) => {
  if (row.status === '已取消') {
    ElMessage.warning('该拼租信息已取消')
    return
  }
  row.status = '已取消'
  ElMessage.success(`已取消「${row.title}」拼租信息`)
}
</script>

<template>
  <div class="page-wrapper">
    <div class="page-title">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/my">我的</el-breadcrumb-item>
          <el-breadcrumb-item>我的拼租</el-breadcrumb-item>
        </el-breadcrumb>
        <h2>我的拼租信息</h2>
      </div>
      <el-button type="primary" @click="handlePublish">发布拼租</el-button>
    </div>

    <div class="section-card">
      <div class="filters">
        <el-input
          v-model="filters.keyword"
          placeholder="搜索拼租标题"
          clearable
          prefix-icon="Search"
        />
        <el-select v-model="filters.type" placeholder="类型筛选" clearable>
          <el-option label="求租" value="求租" />
          <el-option label="招租" value="招租" />
        </el-select>
        <el-select v-model="filters.status" placeholder="状态筛选" clearable>
          <el-option label="进行中" value="进行中" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已取消" value="已取消" />
        </el-select>
      </div>

      <el-table :data="filteredData" stripe>
        <el-table-column prop="title" label="标题" min-width="240" />
        <el-table-column prop="shareType" label="类型" width="120" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="releaseAt" label="发布时间" width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '进行中' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" text size="small" @click="handleView(scope.row)">
              查看详情
            </el-button>
            <el-button text size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" text size="small" @click="handleCancel(scope.row)">
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

@media (max-width: 991px) {
  .filters {
    flex-direction: column;
  }
}
</style>
