import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { Student } from '@/types'

export const useStudentStore = defineStore('students', {
  state: () => ({
    students: {} as Record<number, Student[]>, // Group students by listId
  }),
  actions: {
    async fetchStudentsForGroup(groupId: number) {
      const { data, error } = await supabase.from('students').select('*').eq('listId', groupId)
      if (error) {
        console.error(`Error fetching students for group ${groupId}:`, error)
      } else {
        this.students[groupId] = data
      }
    },
    async addStudent(student: Omit<Student, 'id'>) {
        const { data, error } = await supabase.from('students').insert([student]).select()
        if (error) {
            console.error('Error adding student:', error)
        } else if (data) {
            await this.fetchStudentsForGroup(student.listId)
        }
    },
    async deleteStudent(id: number, listId: number) {
        const { error } = await supabase.from('students').delete().eq('id', id)
        if (error) {
            console.error('Error deleting student:', error)
        } else {
            await this.fetchStudentsForGroup(listId)
        }
    }
  },
})