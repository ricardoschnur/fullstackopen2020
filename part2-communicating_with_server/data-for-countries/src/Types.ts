import * as t from "io-ts";

export const CountryCodec = t.exact(
  t.type({
    name: t.string,
    capital: t.string,
    population: t.number,
    languages: t.array(t.exact(t.type({ name: t.string }))),
    flag: t.string,
  })
);

export const CountriesCodec = t.array(CountryCodec);

export type Country = t.TypeOf<typeof CountryCodec>;
export type Countries = t.TypeOf<typeof CountriesCodec>;

export const CurrentWeatherCodec = t.exact(
  t.type({
    temperature: t.number,
    weather_icons: t.array(t.string),
    wind_speed: t.number,
    wind_dir: t.string,
  })
);

export const WeatherCodec = t.exact(
  t.type({
    current: CurrentWeatherCodec,
  })
);

export type CurrentWeather = t.TypeOf<typeof CurrentWeatherCodec>;
