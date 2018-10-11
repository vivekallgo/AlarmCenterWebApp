import request from '@/utils/request'
import requestDatabaseData from '@/utils/requestDatabaseData'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getAlarms() {
  return requestDatabaseData({
    url: '/AnalyticsAlarm?filter=%7B%22limit%22%3A%22100%22%7D',
    method: 'get'
  })
}
