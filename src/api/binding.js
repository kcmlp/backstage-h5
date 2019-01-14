import request from '@/utils/request'

// 查询父账号
export function getParentUser() {
  return request({
    url: '/backstage/user/sec/getParentUser',
    method: 'get'
  })
}

// 查询子账号
export function getSonUser() {
  return request({
    url: '/backstage//user/sec/getSonUser',
    method: 'get'
  })
}

// 查询父账号的子账号
export function getParentSonUser(uid) {
  return request({
    url: '/backstage/user/sec/getParentSonUser/' + uid,
    method: 'get'
  })
}

// 为父账号绑定子账号
export function doUserSon(data) {
  return request({
    url: '/backstage/user/sec/doUserSon',
    method: 'post',
    data
  })
}

// 为父账号解绑子账号
export function deleteSonUser(uid) {
  return request({
    url: '/backstage/user/sec/deleteSonUser/' + uid,
    method: 'get'
  })
}
