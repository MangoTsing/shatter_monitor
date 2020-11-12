/**
 * 将地址字符串转换成对象
 * @returns 返回一个对象
 */
export function url2obj(
    url: string
  ): {
    host?: string
    path?: string
    protocol?: string
    relative?: string
  } {
    if (!url) {
      return {}
    }
  
    const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/)
  
    if (!match) {
      return {}
    }
  
    const query = match[6] || ''
    const fragment = match[8] || ''
    return {
      host: match[4],
      path: match[5],
      protocol: match[2],
      relative: match[5] + query + fragment // everything minus origin
    }
  }
  