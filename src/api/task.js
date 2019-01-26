import request from '@/utils/request'

export function getDatas() {
  return request({
    url: '/backstage/task/sec/list',
    method: 'get'
  })
}

export function addData(data) {
  return request({
    url: '/backstage/task/sec/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/backstage/task/sec/modify',
    method: 'post',
    data
  })
}

export function deleteData(code) {
  return request({
    url: '/backstage/task/sec/delete/' + code,
    method: 'get'
  })
}

