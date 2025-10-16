<script setup lang="ts">
import { ref } from 'vue'
import { useStudentStore } from '@/stores/students'
import ImageUploader from './ImageUploader.vue'

const props = defineProps<{
  groupId: number
}>()
const emit = defineEmits(['close'])
const studentStore = useStudentStore()

const name = ref('')
const avatar = ref('')

const addStudent = async () => {
  if (!name.value) {
    alert('学生姓名不能为空')
    return
  }
  await studentStore.addStudent({
    name: name.value,
    avatar: avatar.value,
    listId: props.groupId,
  })
  emit('close')
}

const onAvatarUpload = (url: string) => {
  avatar.value = url
}
</script>

<template>
  <form @submit.prevent="addStudent">
    <h3>添加新成员</h3>
    <div class="form-group">
      <label for="student-name">学生姓名</label>
      <input id="student-name" v-model="name" type="text" required>
    </div>
    <div class="form-group">
      <label for="student-avatar">头像</label>
      <ImageUploader @upload="onAvatarUpload" />
      <img v-if="avatar" :src="avatar" alt="Avatar Preview" class="avatar-preview" />
    </div>
    <button type="submit">创建</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 1rem;
  object-fit: cover;
}
</style>
