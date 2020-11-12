/**
 * 用&分割对象，返回a=1&b=2
 * @param obj 需要拼接的对象
 */
export function obj2query(obj: Record<string, unknown>): string {
    return Object.entries(obj).reduce((result, [key, value], index) => {
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }
      if (index !== 0) {
        result += '&'
      }
      result += `${key}=${value}`
      return result
    }, '')
}