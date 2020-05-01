export const safeGet = <T>(obj: T | undefined) => {
  if (obj) {
    return obj
  }
  throw new Error('undefined')
}
