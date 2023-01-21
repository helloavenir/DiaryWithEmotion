import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useReducer, useRef, useEffect } from 'react';

import Home from './pages/Home'
import New from './pages/New'
import Edit from './pages/Edit'
import Diary from './pages/Diary'


const reducer = (state, action) => {
  let newState = []
  switch(action.type) {
    case 'INIT': {
      return action.data
    }
    case 'CREATE': {
      const newItem = {
        ...action.data
      }
      newState = [newItem, ...state]
      break
    }
    case 'REMOVE': {
      newState = state.filter((it) => it.id !== action.targetId)
    }
    case 'EDIT': {
      newState = state.map((it) => 
      it.id === action.data.id? {...action.data} : it
      )
      break
    }
    default:
      return state
  }

  localStorage.setItem('diary', JSON.stringify(newState))
  return newState
}

export const DiaryStateContext = React.createContext()
export const DiaryDispatchContext = React.createContext()

// const dummyData = [
//   {
//     id: 1,
//     emotion: 1,
//     content: '생축~!!!',
//     date: 1674305404687
//   },
//   {
//     id: 2,
//     emotion: 2,
//     content: '리액트 공부 고고',
//     date: 1674305404688
//   },
//   {
//     id: 3,
//     emotion: 3,
//     content: '바쁜 하루',
//     date: 1674305404689
//   },
//   {
//     id: 4,
//     emotion: 4,
//     content: '몸살 기운이...',
//     date: 1674305404690
//   },
//   {
//     id: 5,
//     emotion: 5,
//     content: '오늘은 너무 춥다아~~',
//     date: 1674305404691
//   }  
// ]


function App() {  
  const [data, dispatch] = useReducer(reducer, [])

  // console.log(new Date().getTime())

  useEffect(() => {
    const localData = localStorage.getItem('diary')
    if(localData) {
      // id 중복없이 부여 위해 기존 데이터를 내림차순 정렬 후 맨 위 id 다음 번호를 부여받도록 설정
      const diaryList = JSON.parse(localData).sort((a,b) => parseInt(b.id) - parseInt(a.id))
      
      if(diaryList.length >= 1) {

     

        dataId.current = parseInt(diaryList[0].id) + 1

        // console.log(diaryList)
        // console.log(dataId)

        // 지금의 diaryList를 초기값을 설정해줌
        dispatch({type: "INIT", data:diaryList})
      }
    } 
}, [])

  const dataId = useRef(0)
  // CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE", 
      data: {
        id: dataId.current,  
        date: new Date(date).getTime(),
        content,
        emotion
      },
    })
    dataId.current += 1
  }
  // REMOVE
  const onRemove = (targetId) => {
    dispatch({type: "REMOVE", targetId})
  }  
  // EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content, 
        emotion
      },
    })
  }

  return (
    <DiaryStateContext.Provider value={data}>   
      <DiaryDispatchContext.Provider 
        value={{
          onCreate, 
          onEdit, 
          onRemove,
        }}
      >
        <BrowserRouter>
          <div className="App">
            
            {/* 바뀔 부분 */}
            <Routes>
              {/* 실질적으로 url 경로와 컴포넌트를 맴핑 시켜주는 컴포넌트 */}
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/edit/:id" element={<Edit />} />
              {/* 참고로 diary로만 경로를 지정할 경우에는 아무 것도 뜨지 않게 된다 */}
              <Route path="/diary/:id" element={<Diary />} />          
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
