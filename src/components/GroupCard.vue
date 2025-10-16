<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Group } from '@/types'
import { useStudentStore } from '@/stores/students'
import { useGroupStore } from '@/stores/groups'
import StudentForm from './StudentForm.vue'
import Modal from './Modal.vue'

const props = defineProps<{
  group: Group
}>()

const studentStore = useStudentStore()
const groupStore = useGroupStore()

const students = computed(() => studentStore.students[props.group.id] || [])
const showAddStudentModal = ref(false)

onMounted(() => {
  studentStore.fetchStudentsForGroup(props.group.id)
})

const deleteGroup = () => {
  if (confirm(`确定要删除小组 "${props.group.name}" 吗?`)) {
    groupStore.deleteGroup(props.group.id)
  }
}

const deleteStudent = (studentId: number) => {
    if (confirm(`确定要删除该学生吗?`)) {
        studentStore.deleteStudent(studentId, props.group.id)
    }
}
</script>

<template>
  <div class="group-card">
    <div class="card-header">
      <img :src="group.avatar || '/src/assets/logo.svg'" alt="avatar" class="avatar">
      <h3>{{ group.name }} (Score: {{ group.score }})</h3>
      <button class="delete-group-btn" @click="deleteGroup">×</button>
    </div>
    <div class="student-list">
      <h4>小组成员:</h4>
      <ul>
        <li v-for="student in students" :key="student.id">
          <img :src="student.avatar || '/src/assets/logo.svg'" alt="avatar" class="avatar-small">
          <span>{{ student.name }}</span>
          <button class="delete-student-btn" @click="deleteStudent(student.id)">-</button>
        </li>
      </ul>
      <button class="add-student-btn" @click="showAddStudentModal = true">添加成员</button>
    </div>
  </div>

  <Modal :show="showAddStudentModal" @close="showAddStudentModal = false">
    <StudentForm :group-id="group.id" @close="showAddStudentModal = false" />
  </Modal>
</template>

<style scoped>
.group-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
}
.avatar-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 0.5rem;
}
.delete-group-btn {
    position: absolute;
    top: -10px;
    right: -5px;
    background: #ff4d4d;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
}
.student-list ul {
  list-style: none;
  padding: 0;
}
.student-list li {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}
.student-list li span {
    flex-grow: 1;
}
.add-student-btn {
    margin-top: 1rem;
}
.delete-student-btn {
    background: #ffcccc;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
}
</style>