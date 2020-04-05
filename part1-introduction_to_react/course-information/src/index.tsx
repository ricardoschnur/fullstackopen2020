import React from "react";
import ReactDOM from "react-dom";

interface PartProps {
  name: string;
  exercises: number;
}

const Header = ({ course }: { course: string }) => <h1>{course}</h1>;

const Total = ({ parts }: { parts: PartProps[] }) => (
  <p>
    Number of exercises{" "}
    {parts.map((part) => part.exercises).reduce((a, b) => a + b, 0)}
  </p>
);

const Content = ({ parts }: { parts: PartProps[] }) => (
  <div>
    {parts.map((part) => (
      <p>
        {part.name} {part.exercises}
      </p>
    ))}
  </div>
);

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
