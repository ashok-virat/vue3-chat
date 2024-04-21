<template>
  <v-container style="padding: 0px" fluid>
    <v-card class="pa-2 user-card" tile>
      <v-list v-if="messages.length">
        <v-list-item
          v-for="(item, i) in messages"
          :key="i"
          :value="item"
          color="primary"
          rounded="shaped"
        >
          <v-list-item-title
            :class="
              props.loggedInUserInfo.userId !== item.senderId
                ? 'sender'
                : 'receiver'
            "
            class="user"
            >{{ item.message }}</v-list-item-title
          >
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

const createMessage = async () => {
  console.log(props.user);
  console.log(props.loggedInUserInfo);
  console.log(query.value);
  const req = {
    senderId: props.loggedInUserInfo.userId,
    receiverId: props.user._id,
    receiver: props.user.userName,
    sender: props.loggedInUserInfo.userName,
    message: query.value,
  };
  try {
    sending.value = true;
    const data = await ApiService.createMessage(req);
    console.lof(data);
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
    console.log(data);
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
</style>