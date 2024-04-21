<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-card class="pa-2 user-card" tile>
          <v-list>
            <v-list-subheader>Users</v-list-subheader>

            <v-list-item
              v-for="(item, i) in users"
              :key="i"
              :value="item"
              color="primary"
              rounded="shaped"
              @click="openChat(item)"
            >
              <v-list-item-title class="user">{{
                item.userName
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="9"
        ><chatComponent v-if="loadChat" :user="activeUser"
      /></v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ApiService from "../service/userService";
import chatComponent from "./chatComponent.vue";

const users = ref([]);

const loading = ref(false);

const loadChat = ref(false);

const activeUser = ref({});

const openChat = (user) => {
  loadChat.value = true;
  activeUser.value = user;
};

onMounted(async () => {
  try {
    loading.value = true;
    const data = await ApiService.fetchUsers();
    users.value = data;
    loading.value = false;
  } catch {
    loading.value = false;
  }
});
</script>

<style scoped>
.user {
  text-align: left;
}
.user-card {
  height: calc(100vh - 24px);
  overflow: auto;
}
</style>