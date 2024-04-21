<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-card class="pa-2 user-card" tile>
          <v-list slim>
            <v-list-subheader>Users</v-list-subheader>

            <v-list-item
              v-for="(item, i) in users"
              :key="i"
              :value="item"
              color="primary"
              @keydown.enter.stop
              @click.stop="openChat(item)"
            >
              <v-list-item-title class="user">{{
                item.userName
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="9"
        ><chatComponent
          v-if="loadChat"
          :user="activeUser"
          :loggedInUserInfo="loggedInUserInfo"
      /></v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import ApiService from "../service/userService";
import chatComponent from "./chatComponent.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const users = ref([]);

const loading = ref(false);

const loadChat = ref(false);

const activeUser = ref({});

const loggedInUserInfo = ref({});

const openChat = (user) => {
  loadChat.value = false;
  nextTick(() => {
    loadChat.value = true;
    activeUser.value = user;
  });
};

onMounted(async () => {
  const userInfo = localStorage.getItem("user");
  if (userInfo) {
    loggedInUserInfo.value = JSON.parse(userInfo);
    try {
      loading.value = true;
      const data = await ApiService.fetchUsers();
      users.value = data.filter((x) => x._id !== loggedInUserInfo.value.userId);
      loading.value = false;
    } catch {
      loading.value = false;
    }
  } else {
    router.push("/login");
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