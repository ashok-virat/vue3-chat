<template>
  <v-container class="pa-0" fluid>
    <div class="align-center d-flex navbar justify-space-between px-2">
      <div class="pt-2">
        <img class="logo" alt="Avatar" src="../../public/logo.png" />
      </div>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-avatar color="white" size="36px" class="user-info" v-bind="props">
            <span class="font-weight-bold"> {{ userInfo() }} </span>
          </v-avatar>
        </template>

        <v-list class="px-4">
          <span class="user-info" @click="logout">logout</span>
        </v-list>
      </v-menu>
    </div>
    <v-row class="mt-3 px-2">
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
                <span v-if="!item?.typing" style="display: flex"
                  ><v-badge
                    v-if="item?.newMessages"
                    color="info"
                    :content="item?.newMessages"
                    inline
                  ></v-badge
                  ><v-badge
                    :color="item.active ? 'success' : 'error'"
                    dot
                  ></v-badge
                ></span>
                <span class="dots" v-if="item?.typing" style="display: flex"
                  >...</span
                >
              </v-list-item-title>
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
    activeUser.value.newMessages = 0;
  });
};

const newUserMessages = (message) => {
  messages.value = message;
};

const newMessages = (message) => {
  messages.value.push(message);
};

onBeforeUnmount(() => {
  const user = loggedInUserInfo.value;
  user.active = false;
  ws.value.send(JSON.stringify(user));
  ws.value.close();
  ws.value = "";
});

const emitMessages = (message) => {
  if (ws.value) {
    ws.value.send(JSON.stringify(message));
  }
};

const logout = () => {
  sessionStorage.clear("user");
  router.push("/login");
};

const userInfo = () => {
  return (
    (loggedInUserInfo.value.userName && loggedInUserInfo.value.userName[0]) ||
    ""
  );
};

const connectWs = () => {
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
      } else if (loggedInUserInfo.value.userId === data.receiverId) {
        const findUser = users.value.find((user) => user._id === data.senderId);
        if (findUser) {
          if ("newMessages" in findUser) {
            findUser.newMessages = findUser.newMessages + 1;
          } else {
            findUser.newMessages = 1;
          }
        }
      }
    }
    if (Object.prototype.hasOwnProperty.call(data, "action")) {
      if (loggedInUserInfo.value.userId === data.receiverId) {
        const findUser = users.value.find((user) => user._id === data.senderId);
        if (findUser) {
          findUser.typing = true;
          setTimeout(() => {
            findUser.typing = false;
          }, 1000);
        }
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
    const dupUser = loggedInUserInfo.value;
    dupUser.active = false;
    ws.value.send(JSON.stringify(dupUser));
    const user = loggedInUserInfo.value;
    user.active = true;
    ws.value.send(JSON.stringify(user));
  });

  ws.value.addEventListener("close", function () {
    console.log("WebSocket connection is now closed.");
    setTimeout(() => {
      if (ws.value) {
        connectWs();
      }
    }, 2000);
  });

  window.addEventListener("beforeunload", function () {
    const user = loggedInUserInfo.value;
    user.active = false;
    ws.value.send(JSON.stringify(user));
  });
};

onMounted(async () => {
  const userInfo = localStorage.getItem("user");
  if (userInfo) {
    loggedInUserInfo.value = JSON.parse(userInfo);
    connectWs();
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
  height: calc(100vh - 100px);
  overflow: auto;
}
.user-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  min-height: 50px;
}
.dots {
  animation: typing 1s infinite;
}

@keyframes typing {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.navbar {
  background: black;
  min-height: 60px;
  padding: 0px;
}
.logo {
  width: 40px;
}
.user-info {
  cursor: pointer;
}
</style>