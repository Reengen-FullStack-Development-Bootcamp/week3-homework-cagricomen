<template>
  <div>
    <v-container class="d-flex justify-center mt-3 mb-0">
      <v-row class="d-flex justify-center">
        <v-col cols="4" class="d-flex align-center">
          <div class="d-flex flex-row">
            <v-autocomplete
              :items="getSearchCompany"
              no-filter
              dense
              solo
              label="Search Symbol..."
              clearable
              hide-no-data
              v-model="searchVal"
              :search-input.sync="searchInput"
            >
            </v-autocomplete>
            <v-btn @click="search" class="mb-6 ml-3">Search</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      searchInput: "",
      searchVal: "",
      selectionEvent: false,
    };
  },
  computed: {
    ...mapGetters(["getSearchCompany"]),
    btnKey: {
      get() {
        return this.$store.getters.getTimeSeries;
      },
      set(value) {
        this.$store.dispatch("timeSeries", value);
      },
    },
  },
  watch: {
    searchVal() {
      // to prevent apiSearchData dispatch when any item selected
      this.selectionEvent = true;
      this.setSelectedMatchItem(this.searchVal);
      this.$store.dispatch("apiData");
    },
    searchInput() {
      // dispatch action to get matches
      if (
        !this.selectionEvent &&
        this.searchInput &&
        this.searchInput.length >= 3
      ) {
        this.$store.dispatch("searcData", this.searchInput);
      }
      this.selectionEvent = false;
    },
  },
  methods: {
    ...mapMutations(["setSelectedMatchItem"]),
    search() {
      this.$store.dispatch("apiData", this.searchInput);
      this.$router.push({
        name: "Candle",
        params: { id: this.searchInput },
        query: { view: this.$store.getters.getTimeSeries },
      });
    },
  },

};
</script>

<style scoped></style>
