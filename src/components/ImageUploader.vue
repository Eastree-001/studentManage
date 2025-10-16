<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/supabase'

const emit = defineEmits(['update:modelValue', 'upload'])

const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${Date.now()}.${fileExt}`

  try {
    uploading.value = true
    const { error } = await supabase.storage.from('avatars').upload(filePath, file)
    if (error) throw error

    const expiresIn = 60 * 60 * 24 * 365 * 10 // 10 years
    const { data, error: signedUrlError } = await supabase.storage.from('avatars').createSignedUrl(filePath, expiresIn)
    if (signedUrlError) throw signedUrlError
    if (!data) {
        throw new Error("Could not get signed URL")
    }

    emit('update:modelValue', data.signedUrl)
    emit('upload', data.signedUrl)

  } catch (error: any) {
    alert(`Error uploading file: ${error.message}`)
  } finally {
    uploading.value = false
  }
}

const triggerFileInput = () => {
    fileInput.value?.click()
}
</script>

<template>
  <div class="image-uploader">
    <button type="button" @click="triggerFileInput" :disabled="uploading">
      {{ uploading ? 'Uploading...' : 'Upload Avatar' }}
    </button>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileChange"
      style="display: none"
    />
  </div>
</template>

<style scoped>
.image-uploader button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.image-uploader button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
