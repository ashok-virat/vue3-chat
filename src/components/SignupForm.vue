
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
            <v-form @submit.prevent="submitForm">
              <v-text-field
                v-model="userForm.username"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="userForm.email"
                label="Email"
                type="email"
                required
              ></v-text-field>
              <v-text-field
                v-model="userForm.password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="userForm.status"
                label="Status"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary">Sign Up</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";

const userForm = ref({
  username: "",
  email: "",
  password: "",
  status: "",
});

const submitForm = () => {
  console.log(userForm.value);
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