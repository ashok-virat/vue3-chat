<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-card class="pa-2 pt-0 user-card" tile>
          <div class="user-header align-center d-flex user-header">
            <span class="font-weight-bold">Users</span>
          </div>
          <v-list class="px-0 pt-0">
            <v-list-item
              v-for="(item, i) in users"
              :key="i"
              :value="item"
              color="primary"
              :active="item._id === activeUser._id"
              @keydown.enter.stop
              @click.stop="openChat(item)"
            >
              <v-list-item-title class="user"
                ><span>{{ item.userName }}</span>
                <span style="display: flex"
                  ><v-badge
                    :color="item.active ? 'success' : 'error'"
                    dot
                  ></v-badge></span
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="9"
        ><chatComponent
          v-if="loadChat"
          :user="activeUser"
          :loggedInUserInfo="loggedInUserInfo"
          :messages="messages"
          @newMessages="newMessages"
          @newUserMessages="newUserMessages"
          @emitMessages="emitMessages"
      /></v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { nextTick, onMounted, ref, onBeforeUnmount } from "vue";
import ApiService from "../service/userService";
import chatComponent from "./chatComponent.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const users = ref([]);

const loading = ref(false);

const loadChat = ref(false);

const activeUser = ref({});

const loggedInUserInfo = ref({});

const messages = ref([]);

const ws = ref("");

const openChat = (user) => {
  loadChat.value = false;
  messages.value = [];
  nextTick(() => {
    loadChat.value = true;
    activeUser.value = user;
  });
};

const newUserMessages = (message) => {
  messages.value = message;
};

const newMessages = (message) => {
  messages.value.push(message);
};

onBeforeUnmount(() => {
  if (ws.value) {
    const user = loggedInUserInfo.value;
    user.active = false;
    ws.value.send(JSON.stringify(user));
    ws.value.close();
  }
});

const emitMessages = (message) => {
  if (ws.value) {
    ws.value.send(JSON.stringify(message));
  }
};

onMounted(async () => {
  const userInfo = localStorage.getItem("user");
  if (userInfo) {
    loggedInUserInfo.value = JSON.parse(userInfo);
    ws.value = new WebSocket("wss://pointy-gleaming-sapphire.glitch.me/");

    ws.value.onmessage = (message) => {
      const event = JSON.parse(message.data);
      let data = null;
      if (event?.type === "Buffer") {
        const uint8Array = new Uint8Array(JSON.parse(message.data).data);
        const text = new TextDecoder().decode(uint8Array);
        data = JSON.parse(text);
      } else {
        data = event;
      }
      if (Object.prototype.hasOwnProperty.call(data, "message")) {
        if (
          loggedInUserInfo.value.userId === data.receiverId &&
          activeUser.value._id === data.senderId
        ) {
          newMessages(data);
          setTimeout(() => {
            var userListContainer = document.querySelector(".user-list");
            if (userListContainer) {
              userListContainer.scrollTop = userListContainer.scrollHeight;
            }
          }, 1000);
        }
      }
      if (Array.isArray(data)) {
        users.value.forEach((x) => {
          const findUser = data.find((user) => user.userId === x._id);
          if (findUser) {
            x.active = true;
          } else {
            x.active = false;
          }
        });
      }
    };

    ws.value.addEventListener("open", function () {
      console.log("WebSocket connection is now open.");
      const user = loggedInUserInfo.value;
      user.active = true;
      ws.value.send(JSON.stringify(user));
    });

    window.addEventListener("beforeunload", function () {
      const user = loggedInUserInfo.value;
      user.active = false;
      ws.value.send(JSON.stringify(user));
    });

    try {
      loading.value = true;
      const data = await ApiService.fetchUsers();
      users.value = data.filter((x) => x._id !== loggedInUserInfo.value.userId);
      if (users.value.length) {
        openChat(users.value[0]);
      }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px;
}
.user-card {
  height: calc(100vh - 40px);
  overflow: auto;
}
.user-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  min-height: 50px;
}
</style>