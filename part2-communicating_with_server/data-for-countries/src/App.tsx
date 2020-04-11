import React, { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import {
  Countries,
  CountriesCodec,
  Country,
  CurrentWeather,
  WeatherCodec,
} from "./Types";
import { identity, Validation } from "io-ts";
import { fold, left, map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

interface FilterProps {
  value: string;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const Filter: React.FunctionComponent<FilterProps> = ({ value, onChange }) => (
  <div>
    find countries <input value={value} onChange={onChange} />
  </div>
);

interface WeatherProps {
  weather: Validation<CurrentWeather>;
  capital: string;
}

const Weather: FunctionComponent<WeatherProps> = ({ weather, capital }) => (
  <>
    <h2>Weather in {capital}</h2>
    {pipe(
      weather,
      fold(
        () => <div>No weather information available!</div>,
        (current) => (
          <div>
            <p>
              <strong>temperature:</strong> {current.temperature} Celsius
            </p>
            {current.weather_icons.map((icon) => (
              <img src={icon} alt="weather_icon" width={50} key={icon} />
            ))}
            <p>
              <strong>wind:</strong> {current.wind_speed} km/h direction{" "}
              {current.wind_dir}
            </p>
          </div>
        )
      )
    )}
  </>
);

const CountryDetails = (country: Country) => {
  const [currentWeather, setCurrentWeather] = useState<
    Validation<CurrentWeather>
  >(left([]));

  useEffect(() => {
    if (!process.env.REACT_APP_WEATHER_API_KEY) {
      return;
    }

    axios
      .get(
        "http://api.weatherstack.com/current?access_key="
          .concat(process.env.REACT_APP_WEATHER_API_KEY)
          .concat("&query=")
          .concat(country.capital)
      )
      .then((response) => {
        setCurrentWeather(
          pipe(
            WeatherCodec.decode(response.data),
            map((weather) => weather.current)
          )
        );
      });
  }, [country.capital]);

  return (
    <div key={country.name}>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>Spoken languages</h2>
      <>
        {country.languages.map((language) => (
          <li key={language.name}>{language.name}</li>
        ))}
      </>
      <img src={country.flag} alt="flag" width={150} />
      <Weather weather={currentWeather} capital={country.capital} />
    </div>
  );
};

interface CountryListProps {
  countries: Countries;
  setFilter: (name: string) => void;
}

const CountryList: React.FunctionComponent<CountryListProps> = ({
  countries,
  setFilter,
}) => {
  return countries.length > 10 ? (
    <div>Too many matches, specify another filter</div>
  ) : countries.length === 1 ? (
    <>{countries.map(CountryDetails)}</>
  ) : (
    <div>
      {countries.map((country) => (
        <p key={country.name}>
          {country.name}
          <button onClick={() => setFilter(country.name)}>show</button>
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState<Countries>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      pipe(
        CountriesCodec.decode(response.data),
        fold(() => [], identity),
        setCountries
      );
    });
  }, []);

  return (
    <>
      <Filter
        value={filter}
        onChange={(event) => setFilter(event.currentTarget.value)}
      />
      <CountryList
        countries={countries.filter((country) =>
          country.name.toLowerCase().includes(filter.toLowerCase())
        )}
        setFilter={setFilter}
      />
    </>
  );
};

export default App;
