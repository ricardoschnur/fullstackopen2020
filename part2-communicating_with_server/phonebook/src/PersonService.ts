import axios, { AxiosResponse } from "axios";
import { Person } from "./Types";

const baseUrl = "http://localhost:3001/persons";

const getData = <T>(response: AxiosResponse<T>) => response.data;

const getAll = () => axios.get(baseUrl).then(getData);

const create = (person: Omit<Person, "id">) =>
  axios.post(baseUrl, person).then(getData);

const update = (person: Person) =>
  axios.put(baseUrl.concat(`/${person.id}`), person).then(getData);

const remove = (id: number) => axios.delete(baseUrl.concat(`/${id}`));

export default {
  getAll,
  create,
  update,
  remove,
};
