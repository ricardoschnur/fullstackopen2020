import React, { useEffect, useState } from "react";
import PersonService from "./PersonService";
import { Person } from "./Types";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import "./App.css";

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
  setPersons: (persons: Person[]) => void;
  filter: string;
}

const Persons: React.FunctionComponent<PersonsProps> = ({
  persons,
  setPersons,
  filter,
}) => {
  const deleteWithConfirmation = (id: number) => {
    if (window.confirm("Do you really want delete this number?")) {
      PersonService.remove(id)
        .then(() => persons.filter((other) => other.id !== id))
        .then(setPersons);
    }
  };

  return (
    <>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map((person) => (
          <div key={person.name}>
            {person.name} {person.number}
            <button onClick={() => deleteWithConfirmation(person.id)}>
              delete
            </button>
          </div>
        ))}
    </>
  );
};

interface NotificationProps {
  message: O.Option<Message>;
}

const Notification: React.FunctionComponent<NotificationProps> = ({
  message,
}) =>
  pipe(
    message,
    O.fold(
      () => <></>,
      (message) => <div className={message.kind}>{message.message}</div>
    )
  );

interface Message {
  message: string;
  kind: "success" | "error";
}

const displayMessage = (
  message: Message,
  setMessage: (message: O.Option<Message>) => void
) => {
  setMessage(O.some(message));
  setTimeout(() => {
    setMessage(O.none);
  }, 3000);
};

const App = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [newNumber, setNewNumber] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [message, setMessage] = useState<O.Option<Message>>(O.none);

  useEffect(() => {
    PersonService.getAll().then(setPersons);
  }, []);

  const addName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const existingPerson = O.fromNullable(
      persons.find((person) => person.name.localeCompare(newName) === 0)
    );

    const createNewPerson = () => {
      PersonService.create({
        name: newName,
        number: newNumber,
      })
        .then((person) => persons.concat(person))
        .then(setPersons)
        .then(() =>
          displayMessage(
            { message: `Added ${newName}`, kind: "success" },
            setMessage
          )
        );
    };

    const updateExistingPerson = (newNumber: string) => (person: Person) => {
      const warningMessage = `${newName} is already added to phonebook, replace the old number with a new one?`;
      const successMessage = `Updated ${person.name}`;
      const errorMessage = `Information of ${person.name} has already been removed from server`;

      if (window.confirm(warningMessage)) {
        PersonService.update({ ...person, number: newNumber })
          .then((person) => {
            displayMessage(
              { message: successMessage, kind: "success" },
              setMessage
            );
            return persons.map((other) =>
              other.id === person.id ? person : other
            );
          })
          .catch(() => {
            displayMessage(
              { message: errorMessage, kind: "error" },
              setMessage
            );
            return persons.filter((other) => other.id !== person.id);
          })
          .then(setPersons);
      }
    };

    pipe(
      existingPerson,
      O.fold(createNewPerson, updateExistingPerson(newNumber))
    );
  };

  const handleChange = (set: (val: string) => void) => (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    set(event.currentTarget.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
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
      <Persons persons={persons} setPersons={setPersons} filter={filter} />
    </div>
  );
};

export default App;
