import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isOpen: true
  }),
  
  actions: {
    toggleSidebar() {
      this.isOpen = !this.isOpen
    },
    
    openSidebar() {
      this.isOpen = true
    },
    
    closeSidebar() {
      this.isOpen = false
    }
  }
})