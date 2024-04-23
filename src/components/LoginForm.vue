
<template>
  <v-container class="signup-form" fluid>
    <v-row justify="center" align="center" class="signup-form-row">
      <v-col cols="6">
        <img src="../../public/chat1.jpeg" alt="Chat Image" class="image" />
      </v-col>
      <v-col cols="6">
        <v-card class="mx-auto" max-width="500">
          <v-card-title class="headline">Sign In</v-card-title>
          <v-card-text>
            <v-form class="submit-form" @submit.prevent="submitForm">
              <v-text-field
                v-model="userForm.email"
                variant="underlined"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="userForm.password"
                variant="underlined"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn :loading="loading" type="submit" color="primary"
                >Sign In</v-btn
              >
            </v-form>
            <span class="login-route"
              >Don't have an account yet?
              <a @click="navigateToSignup">Signup</a></span
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
  email: "",
  password: "",
});

const navigateToSignup = () => {
  router.push("/");
};

const submitForm = async () => {
  try {
    loading.value = true;
    const data = await ApiService.login(userForm.value);
    snackbar.value = true;
    message.value = "Signin Successful!";
    const userInfo = {
      userName: data.userName,
      status: data.status,
      userId: data._id,
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setTimeout(() => {
      router.push("/chat");
    }, 500);
    loading.value = false;
  } catch (e) {
    snackbar.value = true;
    message.value = e;
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