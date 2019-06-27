const baseURI = "https://api.openweathermap.org/data/2.5/"

class OpenWeatherMapFacade {
  constructor(units, api_key) {
    this.units = units;
    this.api_key = api_key;
  }

  // TODO: explicitly support country codes
  getCurrentConditions(query, type) {
    let params = {
      units: this.units,
      appid: this.api_key
    };

    if (type === "zip") {
      params = {
        zip: query,
        ...params
      }
    } else {
      params = {
        q: query,
        ...params
      }
    }

    return this._sendRequest("weather", params)
      .then(data => {
        let { coord, main, weather } = data;
        return {
          coord: {
            lat: coord.lat,
            lng: coord.lon
          },
          temps: {
            temp: main.temp,
            max: main.temp_max,
            min: main.temp_min
          },
          weather: weather
        };
      })
  }

  async _sendRequest(endpoint, params) {
    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    const url = `${baseURI}${endpoint}?${queryString}`;
    return fetch(url).then(response => response.json());
  }

  // TODO: add icon for mist
  static getWeatherIcon(code) {
    let icon = "";
    switch (code) {
      case "01n":
        icon = 'night';
        break;
      case "01d":
        icon = 'day';
        break;
      case "02n":
        icon = 'cloudy-night-1';
        break;
      case "02d":
        icon = 'cloudy-day-1';
        break;
      case "03n":
        icon = 'cloudy-day-3';
        break;
      case "03d":
        icon = 'cloudy-night-3';
        break;
      case "04n":
      case "04d":
        icon = 'cloudy';
        break;
      case "09n":
      case "09d":
        icon = 'rainy-6';
        break;
      case "10n":
        icon = 'rainy-5';
        break;
      case "10d":
        icon = 'rainy-3';
        break;
      case "11n":
      case "11d":
        icon = 'thunder';
        break;
      case "13n":
      case "13d":
        icon = 'snowy-6';
        break;
      default:
        icon = '';
    }

    return icon;
  }
}

export default OpenWeatherMapFacade;