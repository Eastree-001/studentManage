<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentStore } from '@/stores/students'
import { useGroupStore } from '@/stores/groups'
import type { Student } from '@/types'
import StudentForm from '@/components/StudentForm.vue'
import Modal from '@/components/Modal.vue'
import DefaultAvatar from '@/components/DefaultAvatar.vue' // Import the new component
import { ElMessage } from 'element-plus' // Use ElMessage for consistency

const route = useRoute()
const studentStore = useStudentStore()
const groupStore = useGroupStore()

const groupId = Number(route.params.id)
const group = computed(() => groupStore.groups.find(g => g.id === groupId))
const students = computed(() => studentStore.students[groupId] || [])

const showAddStudentModal = ref(false)

onMounted(() => {
  // Fetch group info if not already present
  if (!group.value) {
    groupStore.fetchGroups()
  }
  // Fetch students for this group
  studentStore.fetchStudentsForGroup(groupId)
})

const handleDeleteStudent = async (studentId: number) => {
  try {
    await studentStore.deleteStudent(studentId, groupId)
    ElMessage.success('学生删除成功')
  } catch (error) {
    ElMessage.error('学生删除失败')
  }
}
</script>

<template>
  <div>
    <div v-if="group" class="page-header">
      <h1>{{ group.name }} - 学生管理</h1>
      <el-button type="primary" @click="showAddStudentModal = true">添加新成员</el-button>
    </div>

    <el-table :data="students" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="avatar" label="头像">
        <template #default="{ row }">
          <el-avatar v-if="row.avatar" :src="row.avatar" />
          <DefaultAvatar v-else :name="row.name" :size="40" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleDeleteStudent(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Modal :show="showAddStudentModal" @close="showAddStudentModal = false">
      <StudentForm :group-id="groupId" @close="showAddStudentModal = false" />
    </Modal>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
</style>