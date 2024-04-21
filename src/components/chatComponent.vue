<template>
  <v-container style="padding: 0px" fluid>
    <v-card class="pa-2 user-card" tile>
      <v-list v-if="messages.length">
        <v-list-item
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
      <div v-if="!messages.length && !loading">No messages avilable</div>
      <div class="text-area">
        <v-textarea
          v-model="query"
          color="#1867c0"
          rows="1"
          variant="filled"
          auto-grow
          @keydown.enter.prevent="createMessage"
        ></v-textarea>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import ApiService from "../service/userService";

const messages = ref([]);

const loading = ref(false);

const sending = ref(false);

const query = ref("");

const props = defineProps(["user", "loggedInUserInfo"]);

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
    messages.value.push(dupReq);
    sending.value = true;
    query.value = "";
    await ApiService.createMessage(req);
  } catch {
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
    messages.value = data;
    loading.value = false;
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
  height: calc(100vh - 24px);
  overflow: auto;
  position: relative;
}
.text-area {
  position: absolute;
  bottom: 0px;
  width: 98%;
}
.message {
  font-weight: 500;
  font-size: 18px;
  font-style: normal;
}
</style>