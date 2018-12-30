import request from '@/utils/request'

export function getAppVersion() {
  return request({
    url: '/backstage/app/sec/getAppVersion' ,
    method: 'get'
  })
}

export function saveVersion(appVersion) {
  const data = {}
  data.appVersion = appVersion
  return request({
    url: '/backstage/app/sec/saveVersion',
    method: 'post',
    data
  })
}
