
const chart = {
  state: {
    chartdatesingle: '',
    chartloc: '',
    chartdaterange: ''
  },
  mutations: {
    setChartDateSingle(state, val) {
      state.chartdatesingle = val
    },
    setChartLoc(state, val) {
      state.chartloc = val
      window.localStorage.chartloc = JSON.stringify(val)
    },
    setChartDateRange(state, val) {
      state.chartdaterange = val
    }
  },
  actions: {
    setChartDateSingle: ({ commit }, val) => {
      commit('setChartDateSingle', val)
    },
    setChartLoc: ({ commit }, val) => {
      commit('setChartLoc', val)
    },
    setChartDateRange: ({ commit }, val) => {
      commit('setChartDateRange', val)
    }

  }
}

export default chart
