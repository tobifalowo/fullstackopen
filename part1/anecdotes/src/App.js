import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  function getRandomIndex(max) {
    let min = Math.ceil(0);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  const getNextAnecdote = () => {
    let index = getRandomIndex(anecdotes.length)
    // Ensure that the quote changes
    if (index === selected) {
      index = (index + 1) % anecdotes.length
    }
    setSelected(index)
  }

  const applyVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  const getMostVoted = () => {
    const copy = [...points]
    const max = Math.max.apply(null, copy);
    return copy.indexOf(max)
  }

  return (
    <>
    <div>
      <h1>Anecdote of the Day</h1>
      {anecdotes[selected]}
      <br/>
      has {points[selected]} votes
    </div>
    <div>
    <Button handleClick={applyVote} text="Vote" />
    <Button handleClick={getNextAnecdote} text="Next Anecdote" />
    </div>
    <div>
      <h1>Anecdote with the Most Votes</h1>
      {anecdotes[getMostVoted()]}
      <br/>
      has {points[getMostVoted()]} votes
    </div>
    </>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

export default App