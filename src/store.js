import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// import { stat } from 'fs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    inputValue: 'aaa',
    // 下一个ID
    nextId: 5,
    viewkey: 'all'
  },
  mutations: {
    initList (state, list) {
      state.list = list
    },
    // 为store中的inputValue 赋值
    setInputValue (state, val) {
      state.inputValue = val
    },
    // 添加列表项
    addItem (state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据Id删除对应的任务事项
    removeItem (state, id) {
      // 根据id查找对应项的索引
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引，删除对应的元素
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 修改列表列的选中状态
    changeStatus (state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    // 清除已完成的任务
    cleanDone (state) {
      state.list = state.list.filter(x => x.done === false)
    },
    // 修改视图的关键字
    changeViewkey (state, key) {
      state.viewkey = key
    }
  },
  actions: {
    getList (context) {
      axios.get('/list.json').then(({ data }) => {
        console.log(data)
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 统计未完成的任务的条数
    unDoneLength (state) {
      return state.list.filter(x => x.done === false).length
    },
    infolist (state) {
      if (state.viewkey === 'all') {
        return state.list
      }
      if (state.viewkey === 'undone') {
        return state.list.filter(x => !x.done)
      }
      if (state.viewkey === 'done') {
        return state.list.filter(x => x.done)
      }
      return state.list
    }
  }
})
