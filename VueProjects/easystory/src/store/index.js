import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mybooks: [],
    curent: null,
  },
  mutations: {
    ADD_BOOK (state, book) {
      console.log('添加成功');
      state.mybooks.push(book);
      localStorage.setItem('mybooks', JSON.stringify(state.mybooks));
    },
    REMOVE_BOOK (state, bookid) {
      console.log('删除成功');
      state.mybooks = state.mybooks.filter(book => book._id !== bookid);
      localStorage.setItem('mybooks', JSON.stringify(state.mybooks));
    },
    INIT_MYBOOKS (state, books) {
      state.mybooks = books;
    }
  },
  actions: {

  },
  modules: {
  }
})
