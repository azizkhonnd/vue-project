<template>
  <v-navigation-drawer v-model="sidebarStore.isOpen" app permanent color="grey-lighten-4">
    <v-list-item>
        <v-list-item-avatar>
          <v-icon color="primary" size="32">mdi-account-multiple</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Панель управления
          </v-list-item-title>
        </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list nav>
      <v-list-item v-for="item in menuItems" :key="item.title" :to="item.to" router class="text-subtitle-1"
        min-height="48">
        <template #prepend>
          <v-icon :icon="item.icon" size="24"></v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useSidebarStore } from '../../stores/sidebar'

const sidebarStore = useSidebarStore()

const menuItems = [
  {
    title: 'Сотрудники',
    icon: 'mdi-account-group',
    to: '/employees'
  },
  {
    title: 'Документы',
    icon: 'mdi-file-document-multiple',
    to: '/documents'
  }
]
</script>

<style scoped>
.v-list-item {
  padding: 12px 16px !important;
}

.v-list-item-title {
  font-size: 16px !important;
}

.v-icon {
  margin-right: 2px !important;
}
</style>