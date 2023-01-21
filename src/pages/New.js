import { useEffect } from "react"

import DiaryEditor from "../components/DiaryEditor"


const getStringDate = (date) => {
  // ISOString은 YYYY-MM-DDTHH:mm:ss:sssZ 형태라 idx 0~9만 필요
  return date.toISOString().slice(0, 10)
}

const New = () => {

  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0]
    titleElement.innerHTML = `감정 일기장 - 새 일기`
  }, [])

  return (
    <div>
      <DiaryEditor />
    </div>
  )
}

export default New