import React from 'react';
import './App.scss';

import OpenWeatherMap from './OpenWeatherMap';
import Map from './components/Map';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      units: 'imperial',
      data: null,
      icon: '',
      error: false
    }

    this.OpenWeatherMap = new OpenWeatherMap(this.state.units, process.env.REACT_APP_API_KEY);

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleUnitsChange = this.handleUnitsChange.bind(this);
  }

  handleQueryChange(event) {
    this.setState({ query: event.target.value });
  }

  handleUnitsChange(event) {
    console.log(event.target.innerText);
    let unit = '';
    switch (event.target.innerText) {
      case '°F':
        unit = 'imperial';
        break;
      case '°C':
        unit = 'metric'
        break;
      default:
        unit = ''
    }

    this.setState({ units: unit });
    this.OpenWeatherMap.units = unit;

    // Re-run previous query with changed units
    if (this.state.query !== "" && this.state.data) {
      this.getCurrentConditions();
    }
  }

  handleSearch(event) {
    this.getCurrentConditions();
  }

  // TODO: Support multiple weather conditions
  // TODO: Support selecting specific city if duplicates exist
  getCurrentConditions() {
    // Determine if query is a city or a zip code
    let type = /^\d{5}(?:[-\s]\d{4})?$/.test(this.state.query) ? "zip" : "city"

    this.OpenWeatherMap.getCurrentConditions(this.state.query, type)
      .then(data => this.setState({
        data: data,
        icon: OpenWeatherMap.getWeatherIcon(data.weather[0].icon) + '.svg',
        error: false
      }))
      .catch(() => {
        this.setState({
          data: null,
          icon: '',
          error: true
        });
      })
  }

  // TODO: break out into smaller components
  render() {
    return (
      <div className="App">
        <section id="form">
          <div className="search">
            <input type="text" placeholder="city or zip" className="search-field" value={this.state.query} onChange={this.handleQueryChange} />
            <button className="search-button" onClick={this.handleSearch}></button>
          </div>
          <div className="units">
            <button title="Fahrenheit" className={(this.state.units === 'imperial') ? 'active' : ''} onClick={this.handleUnitsChange}>°F</button>
            <button title="Celsius" className={(this.state.units === 'metric') ? 'active' : ''} onClick={this.handleUnitsChange}>°C</button>
            <button title="Kelvin" className={(this.state.units === '') ? 'active' : ''} onClick={this.handleUnitsChange}>°K</button>
          </div>
        </section>
        {this.state.data &&
          <section id="weather">
            <div className="weather-text" style={{
              backgroundImage: `url(./assets/icons/animated/${this.state.icon})`
            }}>
              <span className="high-low">H {this.state.data.temps.max}° | L {this.state.data.temps.min}°</span>
              <h1 className="temp">{Math.round(this.state.data.temps.temp)}°</h1>
              <h3 className="description">{this.state.data.weather[0].description}</h3>
            </div>
            <div className="map">
              <Map coords={this.state.data.coord} icon={this.state.icon} />
            </div>
          </section>
        }

        {this.state.error &&
          <section id="error">
            <p>That search yielded no results</p>
          </section>
        }
      </div>
    );
  }

}

export default App;
