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
        {props.parts.map(part => <Part part={part} key={part.id}/>)}
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

  export { Course }