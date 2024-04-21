
<template>
  <v-container class="signup-form" fluid>
    <v-row justify="center" align="center" class="signup-form-row">
      <v-col cols="6">
        <img src="../../public/chat.jpeg" alt="Chat Image" class="image" />
      </v-col>
      <v-col cols="6">
        <v-card class="mx-auto" max-width="500">
          <v-card-title class="headline">Sign In</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitForm">
              <v-text-field
                v-model="userForm.username"
                variant="underlined"
                label="Username Or Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="userForm.password"
                variant="underlined"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary">Sign Up</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      color="white"
      tile
      location="top"
    >
      {{ message }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ApiService from "../service/userService";

const snackbar = ref(false);

const message = ref("");

const userForm = ref({
  username: "",
  email: "",
  password: "",
  status: "",
});

const submitForm = async () => {
  try {
    await ApiService.submitUserData(userForm.value);
    snackbar.value = true;
    message.value = "Signup Successful!";
  } catch {
    snackbar.value = "Techincal issue";
  }
};

// lifecycle hooks
onMounted(() => {
  console.log("mounted");
});
</script>

<style scoped>
.image {
  max-width: 100%;
  height: auto;
}
.signup-form {
  padding: 0px;
}
.signup-form-row {
  height: 100vh;
}
</style>