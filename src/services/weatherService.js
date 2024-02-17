import {DateTime} from "luxon";

const API_KEY = 'a21f6721827e2f947311e354e6f7632a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + '/' + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY});
    // console.log(url);
    return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
    const {
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather,
        wind: {speed}
    } = data;
    const {main: details, icon} = weather[0]
    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, country, sunrise, sunset, details, icon, speed};
};

// Function to format daily forecast data
const formatDailyForecastWeather = (data) => {
    let { timezone, list } = data;
    if (!list || list.length === 0) {
        return []; // Return an empty array if list is undefined or empty
    }
    return list.slice(1, 6).map(d => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        }
    });
};

// Function to format hourly forecast data
// const formatHourlyForecastWeather = (data) => {
//     let { timezone, list } = data;
//     if (!list || list.length === 0) {
//         return []; // Return an empty array if list is undefined or empty
//     }
//     return list.slice(1, 6).map(d => {
//         return {
//             title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
//             temp: d.temp,
//             icon: d.weather[0].icon
//         }
//     });
// };

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData('weather', searchParams).then(formatCurrentWeather);
    const {lat, lon} = formattedCurrentWeather;
    const formattedDailyForecastWeather = await getWeatherData('forecast/daily', {
        lat, lon, units: searchParams.units,
    }).then(formatDailyForecastWeather);
    // const formattedHourlyForecastWeather = await getWeatherData('forecast/hourly', {
    //     lat, lon, units: searchParams.units,
    // }).then(formatHourlyForecastWeather);
    return {...formattedCurrentWeather, daily: formattedDailyForecastWeather /*, hourly: formattedHourlyForecastWeather*/};
};

const formatToLocalTime = (secs, zone, format= "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export {formatToLocalTime, iconUrlFromCode};

// api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}
// https://pro.openweathermap.org/data/2.5/forecast/hourly?q={city name}&appid={API key}
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}