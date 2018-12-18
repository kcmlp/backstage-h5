import request from '@/utils/request'
import store from '../store'

export function getSmsCode(mobile) {
  return request({
    url: 'backstage/admin/sms/' + mobile,
    method: 'get'
  })
}

export function verifyMobile(mobile, code) {
  return request({
    url: 'backstage/admin/verify/mobile',
    method: 'post',
    data: {
      mobile,
      code
    }
  })
}

export function getUserBasicInfo() {
  return request({
    url: 'userinfo/user/basic/' + store.getters.uid,
    method: 'get'
  })
}
