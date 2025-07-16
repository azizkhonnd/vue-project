<template>
  <v-app>
    <Header />
    <Sidebar />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import Header from './components/header/index.vue'
import Sidebar from './components/sidebar/index.vue'
</script>

<style scoped>
.v-main {
  padding-left: 256px !important;
}
</style>