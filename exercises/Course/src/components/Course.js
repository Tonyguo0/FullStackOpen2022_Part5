const Course = ({ courses }) => {
  console.log("ok", courses);
  return (
    <>
      <h1>Web Development Curriculum</h1>
      {courses.map((course) => (
        <div key={course.id}>
          <Header course={course} />

          <Content parts={course.parts} />

          <Total parts={course.parts} />
        </div>
      ))}
    </>
  );
};

const Header = (props) => {
  console.log("props in header", props);
  return (
    <>
      <h2>{props.course.name}</h2>
    </>
  );
};

const Content = ({ parts }) => {
  console.log("props in Content", parts);

  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part.name} exercises={part.exercises} />
      ))}
    </>
  );
};

const Part = ({ part, exercises }) => {
  return (
    <>
      <p>
        {part} {exercises}
      </p>
    </>
  );
};

const Total = ({ parts }) => {
  const sum = parts.reduce((partialSum, current) => {
    return partialSum + current.exercises;
  }, 0);
  return (
    <>
      <p>
        <b>total of {sum} exercises</b>
      </p>
    </>
  );
};

export default Course;
