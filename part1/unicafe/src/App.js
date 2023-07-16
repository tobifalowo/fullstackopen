import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = () => {
    setGood(good+1)
  }
  
  const handleClickNeutral = () => {
    setNeutral(neutral+1)
  }
  
  const handleClickBad = () => {
    setBad(bad+1)
  }


  return (
    <div>
      <h1>Give Feedback</h1>
      <button onClick={handleClickGood}>
        Good
      </button>
      <button onClick={handleClickNeutral}>
        Neutral
      </button>
      <button onClick={handleClickBad}>
        Bad
      </button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

const Statistics = (props) => {
  if (props.good + props.neutral + props.bad <= 0) {
    return (
      <>
      <h1>Statistics</h1>
      <p>
        No feedback given
      </p>
      </>

    )
  } else {
    return (
      <>
      <h1>Statistics</h1>
      <p>
        Good: {props.good}
      </p>
      <p>
        Neutral: {props.neutral}
      </p>
      <p>
        Bad: {props.bad}
      </p>
      <p>
        All: {props.good + props.neutral + props.bad}
      </p>
      <p>
        Average: {(props.good - props.bad) / (props.good + props.neutral + props.bad)}
      </p>
      <p>
        Positive: {100 * (props.good) / (props.good + props.neutral + props.bad)} %
      </p>
      </>
    )
  }
}

const StatisticLine = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

export default App