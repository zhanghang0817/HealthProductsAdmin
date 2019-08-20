
/**
 * 获取资源服务域名
 * @returns {string}
 */
export function getDownloadHost () {
  var host = 'http://download.zq88.cn'
  if (window.location.host === 'e-admin.rxhui.com') {
    host = 'http://download.zq88.cn'
  } else if (window.location.host === '10.0.0.105:10007') {
    host = 'http://10.0.0.112'
  } else {
    host = 'http://10.0.0.112'
  }
  ;
  return host
}

/**
 * 获取H5页面域名
 * @returns {string}
 */
export function getH5PageHost () {
  var host = 'https://moblie.hczq.com'
  if (window.location.host === 'e-admin.rxhui.com') {
    host = 'https://moblie.hczq.com'
  } else if (window.location.host === '10.0.0.105:10007') {
    host = 'http://mobile-staging.jinhui001.com'
  } else {
    host = 'http://10.0.0.22:8088'
  }
  ;
  return host
}

