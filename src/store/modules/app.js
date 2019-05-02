import { Loading } from 'element-ui';
const app = {
  state: {
    sidebar: {
      opened: !+localStorage.getItem('sidebarStatus'), // 是否打开侧边栏
      show: '', // 是否显示侧边栏
    },
    org: '',  // 组织信息,
    showLoading: {
      full: {},  // 全局的loading
      local: false, // 局部 main组件的loading
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        localStorage.setItem('sidebarStatus', 1);
      } else {
        localStorage.setItem('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    GET_ORG: (state, data) => {
      state.sidebar.org = data;
    },
    SHOW_SIDEBAR: (state, data) => {
      state.sidebar.show = data;
    },
    OPEN_LOADING: (state, data)=>{
      if(data == 'full'){
         state.showLoading.full = Loading.service({
           lock: true,
           text: '请稍后，正在获取数据',
           spinner: 'icon-loading',
         });
      }else if(data == 'local'){
        state.showLoading.local = true;
      }
    },
    CLOS_LOADING: (state, data) =>{
      if(data == 'full') {
        state.showLoading.full.close();
      } else if (data == 'local') {
        state.showLoading.local = false;
      } else {
        // 否则全部关闭
        if(state.showLoading.full && state.showLoading.full.close){
          state.showLoading.full.close();
        }
        state.showLoading.local = false;
      }
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR');
    },
    GetOrg: ({ commit }, data) => {
      commit('GET_ORG', data);
    },
    ShowSidebar: ({ commit }, data) => {
      commit('SHOW_SIDEBAR', data);
    },
    openLoading: ({ commit}, data) =>{
      // data为 full 或者 local
      commit('OPEN_LOADING', data);
    },
    closeLoading: ({ commit}, data) => {
      commit('CLOS_LOADING', data);
    }
  }
};

export default app;
