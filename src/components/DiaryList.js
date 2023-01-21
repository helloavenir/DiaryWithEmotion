import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import MyButton from "./MyButton"
import DiaryItem from "./DiaryItem"

// 최신순, 오래된 순 옵션
const sortOptionList = [
  {value: 'latest', name: '최신순'},
  {value: 'oldest', name: '오래된 순'},
]

// 감정 필터링 옵션
const filterOptionList = [
  {value: 'all', name: '전부 다'},
  {value: 'good', name: '좋은 감정만'},
  {value: 'bad', name: '안 좋은 감정만'},
]

// 정렬 컴포넌트, 전달받은 프랍에 변화가 없으면 렌더링되지 않게 메모이제이션해 최적화
const ControlMenu = React.memo(({value, onChange, optionList}) => {
  return (
    <select className="ControlMenu" value={value} onChange={(e) => onChange(e.target.value)}>
      {optionList.map((it, idx) => (
        <option key={idx} value={it.value}>
          {it.name}
        </option> 
      ))}
    </select>
  ) 
})


const DiaryList = ({ diaryList }) => {
  const navigate = useNavigate()
  // 정렬 기준을 저장할 state
  const [sortType, setSortType] = useState('latest')
  // 감정 기준으로 필터링할 state
  const [filter, setFilter] = useState('all')

  // 옵션에 따른 일기 정렬
  const getProcessedDiaryList = () => {   
    
    // 감정(점수) 필터링 함수
    const filterCallBack = (item) => {
      if(filter === 'good') {
        return parseInt(item.emotion) <= 3
      } else {
        return parseInt(item.emotion) > 3
      }
    }

    // 객체 데이터의 정렬을 위한 비교함수
    const compare = (a, b) => {
      if(sortType === 'latest') {
        // 최신순(내림차순), 혹 문자로 들어올 경우를 대비해 parseInt
        return parseInt(b.date) - parseInt(a.date)
      } else {
        return parseInt(a.date) - parseInt(b.date)
      }
    }

    // sort는 원본 훼손하므로 깊은 복사해 사용(일기를 문자로 바꿨다가 배열로 다시 바꿔 복사본 생성)
    const copyList = JSON.parse(JSON.stringify(diaryList))
  
    const filteredList = 
      filter === 'all' ? copyList : copyList.filter((it) => filterCallBack(it))

    const sortedList = filteredList.sort(compare)
    return sortedList
  }

  return (
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left_col">
          <ControlMenu 
          value={sortType} 
          onChange={setSortType} 
          optionList={sortOptionList} 
          />
          <ControlMenu 
          value={filter} 
          onChange={setFilter} 
          optionList={filterOptionList} 
          />
        </div>
        <div className="right_col">
          <MyButton 
          type={'positive'} 
          text={'새 일기 쓰기'} 
          onClick={() => navigate('/new')} 
          />
        </div>
      </div>
      
      
      {getProcessedDiaryList().map((it) => (
        <DiaryItem key={it.id} {...it} />
      ))}
    </div>
  )
}

DiaryList.defaultProps = {
  diaryList: [],
}

export default DiaryList