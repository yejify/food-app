import React, { useRef, useState } from 'react';

function App() {

  const [bucketList, setBucketList] = useState(["영화관 가기", "매일 책 읽기", "수영 배우기", "코딩하기"]);
  const [text, setText] = useState();
  const inputValue = useRef(null);

  const onSend = () => {
    // console.log(inputValue.current.value)

    setBucketList([...bucketList, inputValue.current.value]);
    setText("");
  };

  //삭제 버튼
  // const onRemove = (id) => {
  //   setBucketList(bucketList.filter(bucketList => bucketList. !== id.index))
  // };

  //삭제 버튼 컴포넌트
  function Button(){
    return
    <button id="addBtn" onClick={onSend}>추가하기</button>
  }

  const bucketLi = bucketList.map((i, index)=>(<li key={index+1} id={index+1}><h2>{i}</h2><button onClick={()=> {
    setBucketList(bucketList.filter(item => item !== i))
  }}>삭제</button></li>));

  return (
    <div>
    <h1>버킷리스트</h1>
    <ul>
      {bucketLi}
    </ul>
    <input value={text} ref={inputValue} onChange={(e) => setText(e.target.value)}></input>
    <Button/>
    </div>
  );
}
export default App;
