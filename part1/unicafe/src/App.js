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
      <Button handleClick={handleClickGood} text="Good" />
      <Button handleClick={handleClickNeutral} text="Neutral" />
      <Button handleClick={handleClickBad} text="Bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  if (props.good + props.neutral + props.bad <= 0) {
    return (
      <>
      <p>
        No feedback given
      </p>
      </>

    )
  } else {
    return (
      <>
      <StatisticLine text="Good" value={props.good} />
      <StatisticLine text="Neutral" value={props.neutral} />
      <StatisticLine text="Bad" value={props.bad} />
      <StatisticLine text="All" value={props.good + props.neutral + props.bad} />
      <StatisticLine text="Average" value={(props.good - props.bad) / (props.good + props.neutral + props.bad)} />
      <StatisticLine text="Positive" value={100 * (props.good) / (props.good + props.neutral + props.bad) + " %"}  />
      </>
    )
  }
}

const StatisticLine = (props) => {
  return (
    <p>{props.text}: {props.value}</p>
  )
}

export default App