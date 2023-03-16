import { useState, useEffect } from "react";
import axios from "axios";
// http://openweathermap.org/img/wn/XXX@2x.png   XXX = CODE FOR WEATHER
 
// https://api.openweathermap.org/data/2.5/weather?q={city name},{country code}&appid={API key}
const api_key = process.env.REACT_APP_API_KEY;
   
const Countries = ({ countries }) => {
  const [countrynametoshow, setCountryNameToShow] = useState("");
  const [showcountry, setShowCountry] = useState(false);

  if (countries.length > 10) {
    if (showcountry === true) {
      setShowCountry(false);
    }
    return <div> Too many matches, specify another filter</div>;
  } else if (countries.length > 1 && countries.length <= 10) {
    const countrytoshow = countries.filter((country) => {
      return (
        country.name.common.toLowerCase() === countrynametoshow.toLowerCase()
      );
    });
    return showcountry === true ? (
      <div>
        <Country country={countrytoshow[0]} />
      </div>
    ) : (
      countries.map((country) => {
        return (
          <div key={country.name.common}>
            {country.name.common}{" "}
            <button
              onClick={() => {
                setShowCountry(true);
                setCountryNameToShow(country.name.common);
              }}
            >
              show
            </button>
          </div>
        );
      })
    );
  } else if (countries.length === 1) {
    if (showcountry === true) {
      setShowCountry(false);
    }
    const country = countries[0];
    return <Country country={country} />;
  } else {
    return <div>No country found, please check the server</div>;
  }
};

const Country = ({ country }) => {
  const [weather, setWeather] = useState({});
  const [weatherstate, setWeatherState] = useState({});
  const [data_url, setData_Url] = useState("");
  const [error, setError] = useState("");

  // getting the data from openweathermap api based on the url
  useEffect(() => {
    // console.log(data_url);
    axios.get(data_url).then((response) => {
      // console.log("main:", response.data.main);
      // console.log("weather:", response.data);
      setWeather(response.data);
    });
  }, [data_url]);

  // setting the url to a value based on the country that's set to
  useEffect(() => {
    setData_Url(
      `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]},${country.cca2}&appid=${api_key}&units=metric`
    );
  }, [country]);

  // check for if weather is undefined
  useEffect(() => {
    if (weather.weather && weather.main && weather.wind) {
      setWeatherState({
        weather: weather.weather,
        wind: weather.wind,
        main: weather.main,
      });
    } else {
      setError(`there was an error: weather object undefined `);
    }
  }, [weather]);
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>
        capital {country.capital[0]}
        <br />
        area {country.area}
      </div>
      <div>
        <h4>languages:</h4>
        <ul>
          {Object.keys(country.languages).map((keyvalue) => {
            return <li key={keyvalue}>{country.languages[keyvalue]}</li>;
          })}
        </ul>
        <div>
          <img
            src={country.flags.png}
            alt={country.name.common}
            width="128"
            height="128"
          />
        </div>
      </div>
      {weatherstate.weather && weatherstate.wind && weatherstate.main ? (
        <div>
          <h2>Weather in {country.capital[0]}</h2>
          <p>temperature {weather.main.temp} Celcius</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      ) : (
        error
      )}
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredcountry, setFilteredCountry] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
      setFilteredCountry(response.data);
    });

    // axios.get("http://localhost:3001/countries").then((response) => {
    //   setCountries(response.data);
    //   setFilteredCountry(response.data);
    // });
    // console.log("countries:", countries);
  }, []);
  // console.log("countries:", countries);

  const handleOnSearchCountry = (event) => {
    setSearch(event.target.value);
    // console.log(search);
    const filteredcountries =
      search === ""
        ? countries
        : countries.filter((country) => {
            // console.log(country.name.common);
            return country.name.common
              .toLowerCase()
              .includes(event.target.value.toLowerCase());
          });
    // console.log("filteredcountries", filteredcountries);
    setFilteredCountry(filteredcountries);
  };
  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleOnSearchCountry} />
        {/* {console.log(countries)} */}
        <Countries countries={filteredcountry} />
      </div>
    </div>
  );
};

export default App;
