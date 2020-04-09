import React, { useEffect, useState } from "react";
import axios from "axios";

interface Person {
  name: string;
  number: string;
}

interface FilterProps {
  value: string;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const Filter: React.FunctionComponent<FilterProps> = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
);

interface PersonFormProps {
  name: string;
  number: string;
  onNameChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onNumberChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const PersonForm: React.FunctionComponent<PersonFormProps> = ({
  name,
  number,
  onNameChange,
  onNumberChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={name} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={number} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

interface PersonsProps {
  persons: Person[];
  filter: string;
}

const Persons: React.FunctionComponent<PersonsProps> = ({
  persons,
  filter,
}) => (
  <>
    {persons
      .filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
      .map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
        </div>
      ))}
  </>
);

const App = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [newNumber, setNewNumber] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (persons.find((person) => person.name.localeCompare(newName) === 0)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }));
    }
  };

  const handleChange = (set: (val: string) => void) => (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    set(event.currentTarget.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleChange(setFilter)} />
      <h3>add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={handleChange(setNewName)}
        onNumberChange={handleChange(setNewNumber)}
        onSubmit={addName}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  );
};

export default App;
