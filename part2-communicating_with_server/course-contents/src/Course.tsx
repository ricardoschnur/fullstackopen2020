import React from "react";

interface PartProps {
  name: string;
  exercises: number;
  id: number;
}

interface CourseProps {
  id: number;
  name: string;
  parts: PartProps[];
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
      <p key={part.id.toString()}>
        {part.name} {part.exercises}
      </p>
    ))}
  </div>
);

export default ({ course }: { course: CourseProps }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);
