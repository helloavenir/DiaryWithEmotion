import { useContext, useState, useEffect } from "react"
import { DiaryStateContext } from "../App"

import MyHeader from './../components/MyHeader'
import MyButton from './../components/MyButton'
import DiaryList from './../components/DiaryList'

const Home = () => {  
  const diaryList = useContext(DiaryStateContext)

  const [data, setData] = useState([])
  const [curDate, setCurDate] = useState(new Date())
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월 `

  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0]
    titleElement.innerHTML = `감정 일기장`
  }, [])

  // 일기를 월별로 추려내는 작업(있을 때에)
  useEffect(() => {
    if(diaryList.length >= 1) {
      const firstDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        1
      ).getTime()
  
      const lastDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth() + 1,
        0,
        // 위의 여기까지가 한 달의 마지막 날만을 의미. 그 다음 표기가 꼭 되어야 함!
        // 그 다음의 시, 분, 초를 23시 59분 59초로 잡아놔야
        23,
        59,
        59
      ).getTime()
  
      setData(
        diaryList.filter((it) => firstDay <= it.date && it.date <= lastDay)
      )
    }    
  }, [diaryList, curDate])

  const increaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate())
    )
  }

  const decreaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate())
    )
  }

  return (
    <div>
      <MyHeader 
        headText={headText} 
        leftChild = {
          <MyButton 
            text={'<'} 
            onClick={decreaseMonth} 
          />
        }
        rightChild = {
          <MyButton 
            text={'>'} 
            onClick={increaseMonth} 
          />
        }
      />
      <DiaryList diaryList={data}/>    
    </div>
  )
}

export default Home