import { getSmsCode, verifyMobile } from '@/api/login'
import { getToken, setToken, removeToken, getUid, setUid, removeUid } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    uid: getUid(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 后端 登出state
    LogOut(commit) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        commit('SET_UID', '')
        removeUid()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        commit('SET_UID', '')
        removeUid()
        resolve()
      })
    },

    // 获取短信验证码
    GetSmsCode(commit, mobile) {
      return new Promise((resolve, reject) => {
        getSmsCode(mobile).then( ()=> {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 检查验证码，并返回用户信息
    VerifyMobile({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        verifyMobile(userInfo.username, userInfo.password).then(response => {
          const data = response.datas
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          setUid(data.uid)
          commit('SET_UID', data.uid)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
