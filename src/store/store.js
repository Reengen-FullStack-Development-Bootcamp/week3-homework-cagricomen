import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiData: [],
    timeSeries: 'DAILY',
    timeSeriesType: null,
    searchCompany: [],
    lowest: null,
    highest: null,
    selectedMatchItem: '',
    request: 0,
    userType: 'Guest',
    log_count: 1,
    load: false
  },
  mutations: {
    SET_TIME_SERIES(state, payload) {
      state.timeSeries = payload
    },
    SET_TIME_SERIES_TYPE(state, payload) {
      state.timeSeriesType = payload
    },
    SET_API_DATA(state, payload) {
      state.apiData = payload
    },
    SET_SEARCH_COMPANY(state, payload) {
      state.searchCompany = payload
    },
    SET_LOWEST(state, payload) {
      state.lowest = payload
    },
    SET_HIGHEST(state, payload) {
      state.highest = payload
    },
    setSelectedMatchItem(state, payload) {
      state.selectedMatchItem = payload;
    }
  },
  actions: {
    timeSeries({ commit }, payload) {
      commit('SET_TIME_SERIES', payload)
    },
    async apiData({ commit, state }, payload) {
      state.request++;
      sessionStorage.setItem("req", state.request)
      var funcKey = { func: '', key: '' }
      switch (state.timeSeries) {
        case 'DAILY':
          funcKey.func = 'TIME_SERIES_DAILY';
          funcKey.key = 'Time Series (Daily)';
          commit('SET_TIME_SERIES_TYPE', 'DAILY')
          break;
        case 'WEEKLY':
          funcKey.func = 'TIME_SERIES_WEEKLY';
          funcKey.key = 'Weekly Time Series';
          commit('SET_TIME_SERIES_TYPE', 'WEEKLY')
          break;
        case 'MONTHLY':
          funcKey.func = 'TIME_SERIES_MONTHLY';
          funcKey.key = 'Monthly Time Series';
          commit('SET_TIME_SERIES_TYPE', 'MONTHLY')
          break;
        default:
          funcKey.func = 'TIME_SERIES_DAILY';
          funcKey.key = 'Time Series (Daily)';
          commit('SET_TIME_SERIES_TYPE', 'DAILY')
          break;
      }
      var options = {
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: {
          function: funcKey.func,
          symbol: payload,
          outputsize: 'compact',
          datatype: 'json'
        },
        headers: {
          'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
          'x-rapidapi-key': '984090767emsh1f339e1d4012aeap1bb5dejsna8cf17e92624'
        }
      };
      axios.request(options).then(function (response) {
        var timeSeries = response.data[funcKey.key];
        // configure response data to use inside chart structure
        var configuredResData = Object.keys(timeSeries).map(timeSeriesKey => {
          // add key value(date) inside each object
          timeSeries[timeSeriesKey]["6. date"] = timeSeriesKey;
          return timeSeries[timeSeriesKey];
        }).reverse().slice(-100)
        console.log(configuredResData)
        commit('SET_API_DATA', configuredResData);
        // get min and max values and set lowest and highest states
        let minChartThreshold = Math.min(...configuredResData.map(item => Number(item["3. low"])));
        commit('SET_LOWEST', minChartThreshold - minChartThreshold % 20);
        let maxChartThreshold = Math.max(...configuredResData.map(item => Number(item["2. high"])));
        commit('SET_HIGHEST', maxChartThreshold - maxChartThreshold % 20 + 20);
      }).catch(function (error) {
        console.error(error);
      });
    },
    async searcData({ commit,state }, payload) {
      state.load = false
      state.request++;
      sessionStorage.setItem("req", state.request)
      var options = {
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: { keywords: payload, function: 'SYMBOL_SEARCH', datatype: 'json' },
        headers: {
          'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
          'x-rapidapi-key': '984090767emsh1f339e1d4012aeap1bb5dejsna8cf17e92624'
        }
      };
      axios.request(options).then(function (response) {
        var data = response.data.bestMatches
        var obj = []
        data.forEach(element => {
          obj.push(element["1. symbol"])
        });
        commit('SET_SEARCH_COMPANY', obj)
        
      }).catch(function (error) {
        console.error(error);
      });
    }

  },
  getters: {
    getTimeSeries(state) {
      return state.timeSeries;
    },
    getTimeSeriesType(state) {
      return state.timeSeriesType
    },
    getLowest(state) {
      return state.lowest
    },
    getHighest(state) {
      return state.highest
    },
    getSearchCompany(state) {
      return state.searchCompany
    }
  },
  modules: {},
});
