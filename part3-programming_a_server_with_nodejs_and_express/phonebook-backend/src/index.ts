import express = require("express");
import morgan = require("morgan");

const app = express();
app.use(express.json());

// Morgan configuration for everything but POST requests
app.use(
  morgan("tiny", {
    skip: (request, _response) => request.method === "POST",
  })
);

// Morgan configuration for POST requests
morgan.token("body", (request, _response) => JSON.stringify(request.body));
app.use(
  morgan("method :url :status :res[content-length] - :response-time ms :body", {
    skip: (request, _response) => request.method !== "POST",
  })
);

interface Person {
  name: string;
  number: string;
  id: number;
}

let persons: Person[] = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/info", (_request, response) => {
  response.send(`<div>Phonebook has info for ${persons.length} people.</div><div>${new Date().toString()}</div>`);
});

app.get("/api/persons", (_request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  person ? response.json(person) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(note => note.id !== id);
  response.status(204).end();
});

const generateRandomId = () => Math.floor(Math.random() * 9999999);

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    response.status(400).json({
      error: "name missing",
    });
    return;
  }

  if (!body.number) {
    response.status(400).json({
      error: "number missing",
    });
    return;
  }

  if (persons.find(person => person.name === body.name)) {
    response.status(400).json({
      error: "name already exists",
    });
    return;
  }

  const person: Person = {
    number: body.number,
    id: generateRandomId(),
    name: body.name,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
