<template>
  <v-app>
    <v-app-bar app color="primary" shaped dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <span class="colors">Week3</span>
      </div>
      <v-spacer></v-spacer>
      <div class="mr-2">
        <router-link to="/">
          <span class="colors mr-2">Home</span>
        </router-link>
        <router-link to="/admin" depressed color="primary" >
          <span class="colors">Admin</span>
        </router-link>
      </div>
      <div class="mt-5">
        <v-switch @click="userTypes" v-model="userType" flat :label="user"></v-switch>
      </div>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      userType: false,
    };
  },
  computed: {
    user() {
      if (this.userType === true) {
        return "Admin";}
      else return "User";
    },
  },
  methods: {
    userTypes() {
      if (this.userType == false) {
       this.$store.state.userType = 'User'
       console.log(this.$store.state.userType)
      } else{
        this.$store.state.userType = 'Admin'
       console.log(this.$store.state.userType)
      }
    },
  },
};
</script>
<style scoped>
.colors {
  color: white;
  font-weight: bold;
  font-size: 20px;
}
</style>
