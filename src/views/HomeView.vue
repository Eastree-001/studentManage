<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/groups'
import { useStudentStore } from '@/stores/students'
import type { Group } from '@/types'
import GroupForm from '@/components/GroupForm.vue'
import Modal from '@/components/Modal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

const groupStore = useGroupStore()
const studentStore = useStudentStore()
const router = useRouter()

const editableGroups = ref<Group[]>([])
const originalGroups = ref<Group[]>([]) // To track changes

// --- Change Tracking ---
const isChanged = computed(() => {
  return JSON.stringify(originalGroups.value) !== JSON.stringify(editableGroups.value)
})

// --- Data Fetching and Watching ---
watch(() => groupStore.groups, (newGroups) => {
  const clonedData = cloneDeep(newGroups)
  editableGroups.value = clonedData
  originalGroups.value = cloneDeep(newGroups) // Store pristine copy for change detection
  if (newGroups && newGroups.length) {
    newGroups.forEach(group => {
      studentStore.fetchStudentsForGroup(group.id)
    })
  }
}, { deep: true })

onMounted(() => {
  groupStore.fetchGroups()
})

// --- Helper and Event Handlers ---
const getStudentNames = (groupId: number) => {
  const students = studentStore.students[groupId] || []
  return students.map(s => s.name).join(', ') || '暂无成员'
}

const saveScores = async () => {
  try {
    await groupStore.updateGroupScores(editableGroups.value)
    ElMessage.success('分数更新成功')
    // After successful save, the current state is the new original state
    originalGroups.value = cloneDeep(editableGroups.value)
  } catch (error: any) {
    ElMessage.error(error.message || '分数更新失败，请检查浏览器控制台获取更多信息。')
    console.error(error)
  }
}

const manageStudents = (groupId: number) => {
  router.push(`/group/${groupId}`)
}

const handleDeleteGroup = (group: Group) => {
  ElMessageBox.confirm(`确定要删除小组 "${group.name}" 吗?`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await groupStore.deleteGroup(group.id)
      ElMessage.success('小组删除成功')
    } catch (error) {
      ElMessage.error('小组删除失败')
    }
  })
}

const showAddGroupModal = ref(false)

</script>

<template>
  <div class="header">
    <h2>小组分数管理</h2>
    <div>
      <el-button 
        type="primary" 
        @click="saveScores" 
        :disabled="!isChanged"
      >
        保存分数
      </el-button>
      <el-button type="success" @click="showAddGroupModal = true">添加新小组</el-button>
    </div>
  </div>

  <el-table :data="editableGroups" style="width: 100%" border>
    <el-table-column prop="name" label="小组名称" width="180" />
    <el-table-column prop="avatar" label="小组头像" width="120">
      <template #default="{ row }">
        <el-avatar :src="row.avatar" />
      </template>
    </el-table-column>
    <el-table-column prop="score" label="分数" width="150">
      <template #default="{ row }">
        <el-input-number v-model="row.score" :min="0" size="small" />
      </template>
    </el-table-column>
    <el-table-column label="组员信息" width="250">
      <template #default="{ row }">
        <span>{{ getStudentNames(row.id) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="220">
        <template #default="{ row }">
            <el-button size="small" @click="manageStudents(row.id)">管理学生</el-button>
            <el-button size="small" type="danger" @click="handleDeleteGroup(row)">删除</el-button>
        </template>
    </el-table-column>
  </el-table>

  <Modal :show="showAddGroupModal" @close="showAddGroupModal = false">
    <GroupForm @close="showAddGroupModal = false" />
  </Modal>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
</style>