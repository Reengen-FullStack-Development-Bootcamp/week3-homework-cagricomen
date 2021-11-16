<template>
  <v-container>
    <h1>Admin Page</h1>
    <v-expansion-panels>
      <v-expansion-panel v-for="(item, i) in items" :key="i">
        <v-expansion-panel-header :class="item.state == 'alert' ? 'alert' : ''">
          
          <v-col cols="">
            {{ item.name }}
          </v-col>
          <v-col cols="">
            {{ item.state }}
          </v-col>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container>
            <v-row> <strong>from: </strong> {{ item.from }} </v-row>
            <v-row> <strong>to: </strong> {{ item.to }} </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import store from "@/store/store";

export default {
  data() {
    return {
      items: [],
    };
  },
  created() {
    let i = 1;
    while (localStorage.getItem(`log${i}`) !== null) {
      localStorage.removeItem("loglevel:webpack-dev-server");
      this.items.push(JSON.parse(localStorage.getItem(`log${i}`)));
      i++;
    }
  },
  beforeRouteEnter(to, from, next) {
    if (store.state.userType != "Admin") {
      let obj = new Object({
        id: store.state.log_count,
        name: `user:${store.state.userType}${Math.floor(
          Math.random() * 999 + 1
        )} - ${new Date().toUTCString()}`,
        state: "alert",
        from: from.fullPath,
        to: to.fullPath,
      });
      localStorage.setItem(`log${store.state.log_count}`, JSON.stringify(obj));
      store.state.log_count++;
      alert("Yetkisiz Kullanıcı");
      next("/");
    } else {
      next();
    }
  },
};
</script>

<style  scoped>
.alert{
  color: red;
}
</style>