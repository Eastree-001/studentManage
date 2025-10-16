import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { Group } from '@/types'

export const useGroupStore = defineStore('groups', {
  state: () => ({
    groups: [] as Group[],
  }),
  actions: {
    async fetchGroups() {
      const { data, error } = await supabase.from('groups').select('*').order('score', { ascending: false })
      if (error) {
        console.error('Error fetching groups:', error)
      } else {
        this.groups = data
      }
    },
    async addGroup(group: Omit<Group, 'id'>) {
        console.log('Adding group:', group)
        const { data, error } = await supabase.from('groups').insert([group]).select()
        if (error) {
            console.error('Error adding group:', error)
        } else if (data) {
            console.log('Added group:', data)
            this.groups.push(data[0])
            await this.fetchGroups() // Refetch to maintain order
        }
    },
    async updateGroup(group: Group) {
        const { error } = await supabase.from('groups').update(group).eq('id', group.id)
        if (error) {
            console.error('Error updating group:', error)
        } else {
            await this.fetchGroups()
        }
    },
    async deleteGroup(id: number) {
        const { error } = await supabase.from('groups').delete().eq('id', id)
        if (error) {
            console.error('Error deleting group:', error)
        } else {
            this.groups = this.groups.filter(g => g.id !== id)
        }
    },
    async updateGroupScores(groups: Group[]) {
        const updates = groups.map(group => 
            supabase.from('groups').update({ score: group.score }).eq('id', group.id)
        );

        const results = await Promise.all(updates);
        const firstError = results.find(res => res.error)?.error;

        if (firstError) {
            console.error('Error updating group scores:', firstError);
            throw new Error(`数据库更新失败: ${firstError.message}`);
        } else {
            await this.fetchGroups();
        }
    }
  },
})