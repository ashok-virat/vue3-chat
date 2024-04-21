<template>
  <v-container fluid>{{ user.userName }}</v-container>
</template>

<script setup>
import { defineProps } from "vue";

defineProps(["user"]);
</script>

<style scoped>
</style>