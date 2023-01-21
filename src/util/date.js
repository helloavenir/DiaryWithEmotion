export const getStringDate = (date) => {
  // ISOString은 YYYY-MM-DDTHH:mm:ss:sssZ 형태라 idx 0~9만 필요
  return date.toISOString().slice(0, 10)
}