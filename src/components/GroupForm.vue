<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore } from '@/stores/groups'
import ImageUploader from './ImageUploader.vue'

const emit = defineEmits(['close'])
const groupStore = useGroupStore()

const name = ref('')
const score = ref(0)
const avatar = ref('')

const addGroup = async () => {
  if (!name.value) {
    alert('小组名称不能为空')
    return
  }
  await groupStore.addGroup({
    name: name.value,
    score: score.value,
    avatar: avatar.value,
  })
  emit('close')
}

const onAvatarUpload = (url: string) => {
  avatar.value = url
}
</script>

<template>
  <form @submit.prevent="addGroup">
    <h3>添加新小组</h3>
    <div class="form-group">
      <label for="group-name">小组名称</label>
      <input id="group-name" v-model="name" type="text" required>
    </div>
    <div class="form-group">
      <label for="group-score">分数</label>
      <input id="group-score" v-model.number="score" type="number">
    </div>
    <div class="form-group">
      <label for="group-avatar">头像</label>
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
