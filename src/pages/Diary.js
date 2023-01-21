import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState  } from "react"
import { DiaryStateContext } from "../App"

import { getStringDate } from "../util/date.js"
import { emotionList } from "../util/emotion.js"

import MyHeader from "../components/MyHeader"
import MyButton from "../components/MyButton"


const Diary = () => {
  // useParams로 일기 id를 전달
  const {id} = useParams()
  const diaryList = useContext(DiaryStateContext)
  const navigate = useNavigate()
  const [data, setData] = useState()

  // 일기가 바뀔 때마다 타이틀을 바꿀 예정([] ; 마운트될 때)
  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0]
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기`
  }, [])

  useEffect(() => {
    if(diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      )
      
      // 일기가 있으면
      if(targetDiary) {
        setData(targetDiary)
      } else {
        alert('없는 일기입니다.')
        navigate('/', { replace: true })
      }
    }
  }, [id, diaryList])

  if(!data) {
    return <div className="DiaryPage">로딩 중입니다...</div>
  } else {
    const curEmotionData = emotionList.find(
      (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
    )
    // console.log(curEmotionData)

    return (
      <div className="DiaryPage">
        <MyHeader 
          headText={`${getStringDate(new Date(data.date))} 기록`} 
          leftChild={
            <MyButton 
              text={'< 뒤로 가기'} 
              onClick={() => navigate(-1)} />
          }
          rightChild={
            <MyButton 
              text={'수정하기'} 
              onClick={() => navigate(`/edit/${data.id}`)}
            />
          }
        />
        {/* 내부가 컨텐츠라는 것을 알려주는 시멘틱태그 article을 사용 */}
        <article>
          <section>
            <h4>오늘의 감정</h4>
            <div 
              className={[
                "diary_img_wrapper",
                `diary_img_wrapper_${data.emotion}`,
              ].join(" ")}
            >
              <img src={ curEmotionData.emotion_img } />
              <div className="emotion_description">
                { curEmotionData.emotion_description }
              </div>
            </div>
          </section>
          <section>
            <h4>오늘의 일기</h4>
            <div className="diary_content_wrapper">
              <p>{ data.content }</p>
            </div>
          </section>
        </article>
      </div>
    )
  }
}

export default Diary