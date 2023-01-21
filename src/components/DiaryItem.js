import { useNavigate } from "react-router-dom"
import MyButton from "./MyButton"
import React from 'react'

const DiaryItem = ({ id, emotion, content, date }) => {

  const navigate = useNavigate()

  const env = process.env
  env.PUBLIC_URL = env.PUBLIC_URL || ""

  // 날짜를 보기 좋게
  const strDate = new Date(parseInt(date)).toLocaleDateString()

  // 상세 페이지로 이동하는 함수
  const goDetail = () => {
    navigate(`/diary/${id}`)
  }

  // 수정 페이지로 이동하는 함수
  const goEdit = () => {
    navigate(`/edit/${id}`)
  }
  
  return (
    <div className="DiaryItem">
      <div 
        className={[
          "emotion_img_wrapper", 
          `emotion_img_wrapper_${emotion}`,
          ].join(" ")}
        onClick={goDetail}
      >
        <img src={process.env.PUBLIC_URL + `assets/emotion${emotion}.png`} />
      </div>
      <div 
        className="info_wrapper" 
        onClick={goDetail}
      >
        <div className="diary_date">{strDate}</div>
        <div className="diary_content_preview">{content.slice(0, 25)}</div>
      </div>

      <div className="btn_wrapper">
        <MyButton 
          text={"수정하기"} 
          onClick={goEdit}
        />
      </div>
    </div>
  )
}

export default React.memo(DiaryItem)