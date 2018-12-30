import request from '@/utils/request'

export function getChannel() {
  return request({
    url: '/backstage/channel/sec/getChannel',
    method: 'get'
  })
}

export function saveChannel(data) {
  return request({
    url: '/backstage/channel/sec/saveChannel',
    method: 'post',
    data
  })
}
