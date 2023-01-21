import { useNavigate, useParams} from "react-router-dom"
// context를 통해 일기 리스트를 받아옴
import { useContext, useEffect, useState  } from "react"
import { DiaryStateContext } from "../App"
import DiaryEditor from "../components/DiaryEditor"


const Edit = () => {
  const navigate = useNavigate()
  // 수정할 일기 아이디를 받아올 useParams
  const { id } = useParams()
  // console.log(id)

  const diaryList = useContext(DiaryStateContext)
  // console.log(diaryList)

  // targetDiary(수정할 일기)를 저장할 state
  const [originalData, setOriginalData] = useState()

  // Edit 컴포넌트가 마운트 되었을 때 

  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0]
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기 수정`
  }, [])

  // 
  useEffect(() => {
    if(diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        // useParams 통해 ej
        (it) => parseInt(it.id) === parseInt(id)
      )
      // console.log(targetDiary)

      // 없는 일기를 수정하려할 때 HOME으로 이동되게 함
      if(targetDiary) {
        setOriginalData(targetDiary)
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [id, diaryList])

  return (
    <div>
      {/* New 컴포넌트와 다르게 '새 일기 쓰기' 대신 '일기 수정하기' 등으로 변경 */}
      {originalData && <DiaryEditor isEdit={true} originalData={originalData}/>}
    </div>
  )
}

export default Edit