<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="toggleSidebar" />
    
    <v-toolbar-title>
      <v-icon class="mr-2">mdi-office-building</v-icon>
      Корпоративная Система
    </v-toolbar-title>

    <v-spacer />

    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    
    <v-btn icon>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useSidebarStore } from '../../stores/sidebar'

const sidebarStore = useSidebarStore()

const toggleSidebar = () => {
  sidebarStore.toggleSidebar()
}
</script>