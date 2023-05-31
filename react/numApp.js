import { useState } from "react";

function App() {
  const [number, setNumber] = useState(0);

  // const increase = () => {
  //   setNumber(number+1)
  // }

  // const decrease = () => {
  //   if(number>0){
  //   setNumber(number-1)
  //   }
  // }

  return (
    <div className="App">
      <h1>{number}</h1>
      <button onClick={() => setNumber(number + 1)}>+1</button>
      {number ? <button onClick={() => setNumber(number - 1)}>-1</button>:<button>-1</button>}
    </div>
  );
}

export default App;
