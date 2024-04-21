
<template>
  <v-container class="signup-form" fluid>
    <v-row justify="center" align="center" class="signup-form-row">
      <v-col cols="6">
        <img src="../../public/chat.jpeg" alt="Chat Image" class="image" />
      </v-col>
      <v-col cols="6">
        <v-card class="mx-auto" max-width="500">
          <v-card-title class="headline">Sign Up</v-card-title>
          <v-card-text>
            <v-form class="submit-form" @submit.prevent="submitForm">
              <v-text-field
                v-model="userForm.userName"
                variant="underlined"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="userForm.email"
                variant="underlined"
                label="Email"
                type="email"
                required
              ></v-text-field>
              <v-text-field
                v-model="userForm.password"
                variant="underlined"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="userForm.status"
                variant="underlined"
                label="Status"
                required
              ></v-text-field>
              <v-btn :loading="loading" type="submit" color="primary"
                >Sign Up</v-btn
              >
            </v-form>
            <span class="login-route"
              >Already have an account?
              <a @click="navigateToLogin">login</a></span
            >
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
import { ref } from "vue";
import ApiService from "../service/userService";
import { useRouter } from "vue-router";

const router = useRouter();

const snackbar = ref(false);

const message = ref("");

const loading = ref(false);

const userForm = ref({
  userName: "",
  email: "",
  password: "",
  status: "",
});

const navigateToLogin = () => {
  router.push("/login");
};

const submitForm = async () => {
  try {
    loading.value = true;
    await ApiService.submitUserData(userForm.value);
    snackbar.value = true;
    message.value = "Signup Successful!";
    loading.value = false;
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch {
    snackbar.value = "Techincal issue";
    loading.value = false;
  }
};
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
.login-route a {
  cursor: pointer;
}
.login-route a:hover {
  color: #1867c0;
}
.submit-form {
  padding-bottom: 10px;
}
</style>