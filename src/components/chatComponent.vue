<template>
  <v-container style="padding: 0px" fluid>
    <v-card class="user-card" tile>
      <div class="align-center d-flex navbar pl-2">
        <v-avatar color="black" size="x-small">
          {{ user.userName[0] }}
        </v-avatar>
        <span class="font-weight-medium pl-3"
          ><p class="text-left">{{ user.userName }}</p>
          <p
            v-if="user?.active && !user?.typing"
            class="text-left text-success online"
          >
            online
          </p>
          <p v-if="user?.typing" class="text-left text-success online">
            typing...
          </p></span
        >
      </div>
      <v-list v-if="messages.length" class="pa-2 user-list">
        <v-list-item
          class="px-1"
          ripple
          v-for="(item, i) in messages"
          :key="i"
          :value="item"
          :active="false"
        >
          <v-list-item-title
            :class="
              props.loggedInUserInfo.userId !== item.senderId
                ? 'sender'
                : 'receiver'
            "
            class="user"
            ><span class="message">{{ item.message }}</span>

            <p style="font-size: 12px">
              {{ convertDate(item.timestamp) }}
            </p>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <div v-if="!messages.length && !loading" class="loader">
        No messages available
      </div>
      <div v-if="loading" class="loader">
        <v-progress-circular
          :size="30"
          color="black"
          indeterminate
        ></v-progress-circular>
      </div>
      <div class="text-area">
        <v-textarea
          v-model="query"
          color="#1867c0"
          rows="1"
          variant="filled"
          auto-grow
          @keydown.enter.prevent="createMessage"
          @input="debouncedFunction"
          hide-details
        ></v-textarea>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, defineProps, onMounted, defineEmits, nextTick } from "vue";
import ApiService from "../service/userService";
import lodash from "lodash";

const loading = ref(false);

const sending = ref(false);

const query = ref("");

const props = defineProps(["user", "loggedInUserInfo", "messages"]);

const emit = defineEmits(["newMessages", "newUserMessages", "emitMessages"]);

const convertDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const userFriendlyDate = date.toLocaleString("en-US", options);
  return userFriendlyDate;
};

const generateTimestamp = () => {
  const date = new Date();
  const timestamp = date.toISOString().replace("Z", "");
  return `${timestamp}Z`;
};

const sendTyping = () => {
  const req = {
    senderId: props.loggedInUserInfo.userId,
    receiverId: props.user._id,
    receiver: props.user.userName,
    sender: props.loggedInUserInfo.userName,
    action: "typring..",
  };
  emit("emitMessages", req);
};

const debouncedFunction = lodash.debounce(sendTyping, 500);

const createMessage = async () => {
  const req = {
    senderId: props.loggedInUserInfo.userId,
    receiverId: props.user._id,
    receiver: props.user.userName,
    sender: props.loggedInUserInfo.userName,
    message: query.value,
  };
  try {
    const dupReq = structuredClone(req);
    dupReq["timestamp"] = generateTimestamp();
    emit("newMessages", dupReq);
    sending.value = true;
    query.value = "";
    setTimeout(() => {
      var userListContainer = document.querySelector(".user-list");
      if (userListContainer) {
        userListContainer.scrollTop = userListContainer.scrollHeight;
      }
    }, 1000);
    emit("emitMessages", dupReq);
    await ApiService.createMessage(req);
  } catch (e) {
    sending.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    const req = {
      senderId: props.loggedInUserInfo.userId,
      receiverId: props.user._id,
    };
    const data = await ApiService.fetchMessages(req);
    emit("newUserMessages", data);
    loading.value = false;
    nextTick(() => {
      var userListContainer = document.querySelector(".user-list");
      if (userListContainer) {
        userListContainer.scrollTop = userListContainer.scrollHeight;
      }
    });
  } catch {
    loading.value = false;
  }
});
</script>

<style scoped>
.sender {
  text-align: left;
}
.receiver {
  text-align: right;
}
.user-card {
  height: calc(100vh - 40px);
  overflow: auto;
  position: relative;
  padding: 0px;
}
.text-area {
  position: absolute;
  bottom: 0px;
  width: 100%;
}
.message {
  font-weight: 500;
  font-size: 18px;
  font-style: normal;
  white-space: normal;
}
.user-list {
  height: calc(100vh - 145px);
  overflow: auto;
}
.navbar {
  background: #e3e3e3;
  min-height: 50px;
  padding: 0px;
}
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
}
.online {
  font-size: 12px;
}
</style>