import React, {useState, useEffect} from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY(index) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let y = Math.ceil((index + 1) / 3);
    let x = (index + 1) - ((y - 1) * 3);
    return [x, y]
  }

  function getXYmessage(xy){
    let x = xy[0];
    let y = xy[1];
    return `Coordinates (${x}, ${y})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setSteps(initialSteps);
    setIndex(initialIndex);
    setMessage(initialMessage);
    setEmail(initialEmail);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let newIndex = index;
    
    if (direction === 'left' && index !== 0 && index !== 3 && index !== 6){
      newIndex -= 1;
      setSteps(steps + 1);
    }
    if (direction === 'right' && index !== 2 && index !== 5 && index !== 8){
      newIndex += 1;
      setSteps(steps + 1);
    }
    if (direction === 'up' && index !== 0 && index !== 1 && index !== 2){
      newIndex -= 3;
      setSteps(steps + 1);
    }
    if (direction === 'down' && index !== 6 && index !== 7 && index !== 8){
      newIndex += 3;
      setSteps(steps + 1);
    }

    if (direction === 'left' && (index === 0 || index === 3 || index === 6)){
      setMessage("You can't go left")
    } else if (direction === 'right' && (index === 2 || index === 5 || index === 8)){
      setMessage("You can't go right")
    } else if (direction === 'up' && (index === 0 || index === 1 || index === 2)){
      setMessage("You can't go up")
    } else if (direction === 'down' && (index === 6 || index === 7 || index === 8)){
      setMessage("You can't go down")
    } else setMessage("")

    return newIndex;
    
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    if (evt.target.id !== 'reset'){
      setIndex(getNextIndex(evt.target.id));
      
    } else reset();
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const xy = getXY(index)
    axios.post('http://localhost:9000/api/result', {
      x: xy[0],
      y: xy[1],
      steps: steps,
      email: email
    })
    .then(res => {
      setMessage(res.data.message)
      setEmail(initialEmail)
    })
    .catch(err => {
      setMessage(err.response.data.message)
    })
  }


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYmessage(getXY(index))}</h3>
        <h3 id="steps">{steps === 1 ? `You moved ${steps} time` : `You moved ${steps} times`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad" onClick={move}>
        <button id="left">LEFT</button>
        <button id="up">UP</button>
        <button id="right">RIGHT</button>
        <button id="down">DOWN</button>
        <button id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
