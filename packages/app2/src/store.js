const debug = process.env.NODE_ENV !== 'production'
export const store = {
  state: {
    count: 2
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
}