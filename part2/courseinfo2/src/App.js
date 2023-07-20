const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return <>
    <h1>Web Development Curriculum</h1>
    {courses.map(course => <Course course={course} />)}
  </>
}

const Course = (props) => {
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts}/>
      <Total parts={props.course.parts} />
    </div>
  )
}

const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map(part => <Part part={part}/>)}
    </div>
  )
}

const Part = (props) => {
  return (
    <>
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    </>
  )
}

const Total = (props) => {
  const nofExercises = props.parts.map(a => a.exercises).reduce((a, b) => {return a + b}, 0)

  return(
    <b>Total of {nofExercises} exercises</b>
  )
}

export default App