<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGroupStore } from '@/stores/groups'
import ImageUploader from './ImageUploader.vue'
import type { Group } from '@/types'

const props = defineProps<{
  group?: Group | null
}>()

const emit = defineEmits(['close'])
const groupStore = useGroupStore()

const name = ref('')
const score = ref(0)
const avatar = ref('')

const isEditing = computed(() => !!props.group)

onMounted(() => {
  if (props.group) {
    name.value = props.group.name
    score.value = props.group.score
    avatar.value = props.group.avatar || ''
  }
})

const handleSubmit = async () => {
  if (!name.value) {
    alert('小组名称不能为空')
    return
  }

  if (isEditing.value && props.group) {
    await groupStore.updateGroup({
      ...props.group,
      name: name.value,
      score: score.value,
      avatar: avatar.value,
    })
  } else {
    await groupStore.addGroup({
      name: name.value,
      score: score.value,
      avatar: avatar.value,
    })
  }
  emit('close')
}

const onAvatarUpload = (url: string) => {
  avatar.value = url
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h3>{{ isEditing ? '编辑小组' : '添加新小组' }}</h3>
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
    <button type="submit">{{ isEditing ? '保存' : '创建' }}</button>
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