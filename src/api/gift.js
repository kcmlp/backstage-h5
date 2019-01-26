import request from '@/utils/request'

export function getDatas() {
  return request({
    url: '/backstage/gift/sec/list',
    method: 'get'
  })
}

export function addData(data) {
  return request({
    url: '/backstage/gift/sec/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/backstage/gift/sec/modify',
    method: 'post',
    data
  })
}

export function deleteData(id) {
  return request({
    url: '/backstage/gift/sec/delete/' + id,
    method: 'get'
  })
}

