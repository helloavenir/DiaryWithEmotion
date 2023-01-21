import { useRef, useState, useContext, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { DiaryDispatchContext } from "../App"

import MyHeader from "./MyHeader"
import MyButton from "./MyButton"
import EmotionItem from "./EmotionItem"

import { getStringDate } from "../util/date.js"
import { emotionList } from "../util/emotion"





const env = process.env
// 경로에 맞는게 없을 경우를 대비해 작성
env.PUBLIC_URL = env.PUBLIC_URL || ""



const DiaryEditor = ({ isEdit, originalData }) => {

  const [date, setDate] = useState(getStringDate(new Date()))
  // '그럭 저럭' 감정을 디폴트 설정
  const [emotion, setEmotion] = useState(3)
  const [content, setContent] = useState("")

  // 뒤로 가기 링크 이동 위해 navigate객체 설정
  const navigate = useNavigate()
  // 일기 입력 미완료시 포커스하기 위해 ref객체 설정
  const contentRef = useRef()
  // DiaryDispatchContext에서 onCreate 함수 받아오기, 일기 저장
  const {onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext)
  
  // 메모이제이션하기 위해 useCallback함수로 전달
  const handleClickEmotion = useCallback((emotion) => {
    setEmotion(emotion)
  }, [])
  // 작성 완료 버튼 이벤트 핸들러
  const handleSubmit = () => {
    if(content.length < 1) {
      contentRef.current.focus()
      return
    }

    if(window.confirm(isEdit? '일기를 수정하시겠습니까?' : '새로운 일기를 작성하시겠습니까?'))
      if(!isEdit) {
        onCreate(date, content, emotion)
      } else {
        onEdit(originalData.id, date, content, emotion)
      }
    
    // 일기 작성마치면 HOME으로 돌아가기, 
    // 옵션으로 HOME에서 다시 일기작성한 곳으로 못오게 막음
    navigate('/', { replace: true })
  }

  const handleRemove = () => {
    if(window.confirm('정말 삭제하시겠습니까?')) {
      onRemove(originalData.id)
      navigate('/', { replace: true })
    }
  }
    

  // isEdit이나 originalData 값이 바뀌면
  useEffect(() => {
    if(isEdit) {
      // 수정하려는 게 맞으면
      setDate(getStringDate(new Date(parseInt(originalData.date))))
      setEmotion(originalData.emotion)
      setContent(originalData.content)
    }
  }, [isEdit, originalData])

  return (
    <div className="DiaryEditor">
      <MyHeader 
        headText={isEdit? '일기 수정하기' : '새 일기 쓰기'} 
        leftChild={
          <MyButton 
            text={'< 뒤로 가기'} 
            onClick={() => navigate(-1)} 
          />
        }
        rightChild={
          // 수정하는 상황(isEdit 참)이 다이어리 에디터일 경우에만 작동하도록 작성
          isEdit && (
            <MyButton 
              text={'삭제 하기'} 
              type={'negative'}
              onClick={handleRemove} 
            />
          )
        }
      />
      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box">
            {/* 달력 */}
            <input 
              className="input_date"
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} />
          </div>
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className="input_box emotion_list_wrapper">
            {emotionList.map((it) => (
              <EmotionItem 
                key={it.emotion_id} 
                {...it}
                onClick={handleClickEmotion}
                // 선택된 감정 체크&스타일링 하기 위해 변수 설정
                isSelected = {it.emotion_id === emotion}
                />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box text_wrapper">
            <textarea 
              placeholder="오늘은 어땠나요?"
              ref={contentRef} 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>
        <section>
          <div className="control_box">
            <MyButton 
              text={'취소하기'} 
              onClick={() => navigate(-1)} 
            />
            <MyButton 
              text={'작성 완료'} 
              type={'positive'} 
              onClick= {handleSubmit} 
            />
          </div>
        </section>

      </div>
    </div>
  )
}

export default DiaryEditor