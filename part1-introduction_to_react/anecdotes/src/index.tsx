import React, { useState } from "react";
import ReactDOM from "react-dom";

const App = ({ anecdotes }: { anecdotes: string[] }) => {
  const [selected, setSelected] = useState(0);
  const [voteCount, setVoteCount] = useState(anecdotes.map((_anecdote) => 0));

  const handleNext = () =>
    setSelected(Math.floor(Math.random() * anecdotes.length));
  const handleVote = () =>
    setVoteCount(
      voteCount.map((count, index) => (index === selected ? ++count : count))
    );

  const mostVotesIndex = voteCount.findIndex(
    (count) => count === voteCount.reduce((a, b) => Math.max(a, b))
  );

  return (
    <div>
      <h1> Anecdote of the day </h1>
      {anecdotes[selected]}
      <p>has {voteCount[selected]} votes</p>
      <p>
        <button onClick={handleNext}>next anecdote</button>
        <button onClick={handleVote}>vote</button>
      </p>
      <h1> Anecdote with most votes </h1>
      {anecdotes[mostVotesIndex]}
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
