import request from '@/utils/request'

export function getChannel(page) {
  return request({
    url: '/backstage/channel/sec/getChannel/' + page,
    method: 'get'
  })
}

export function saveChannel(data) {
  return request({
    url: '/backstage//channel/sec/saveChannel',
    method: 'post',
    data
  })
}
