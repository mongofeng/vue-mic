const debug = process.env.NODE_ENV !== 'production'
export const store = {
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
}