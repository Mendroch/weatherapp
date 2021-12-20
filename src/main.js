import { getWeatherByCity } from './apiService.js';
import { mapListToDOMElements } from './DOMActions.js';

class WeatherApp {
    constructor () {
        this.viewElems = {}
        this.initializeApp();
    }

    initializeApp = () => {
        this.connectDOMElements();
        this.setupListeners();
    }

    connectDOMElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
        this.viewElems = mapListToDOMElements(listOfIds);
    }

    setupListeners = () => {
        this.viewElems.searchInput.addEventListener('keydown', this.handleSubmit)
        this.viewElems.searchButton.addEventListener('click', this.handleSubmit)
        this.viewElems.returnToSearchBtn.addEventListener('click', this.returnToSearch)
    }

    handleSubmit = () => {
        if (event.type === 'click' || event.key === 'Enter') {
            this.fadeInOut();
            let query = this.viewElems.searchInput.value;
            getWeatherByCity(query).then(data => {
                this.displayWeatherData(data);
                this.viewElems.searchInput.style.borderColor = 'black';
            }).catch(() => {
                this.fadeInOut();
                this.viewElems.searchInput.style.borderColor = 'red';
            })
        }
    }

    fadeInOut = () => {
        if (this.viewElems.mainContainer.style.opacity === '1' || this.viewElems.mainContainer.style.opacity === '') {
            this.viewElems.mainContainer.style.opacity = '0';
        } else {
            this.viewElems.mainContainer.style.opacity = '1';
        }
    }

    switchView = () => {
        if (this.viewElems.weatherSearchView.style.display !== 'none') {
            this.viewElems.weatherSearchView.style.display = 'none';
            this.viewElems.weatherForecastView.style.display = 'block';
        } else {
            this.viewElems.weatherForecastView.style.display = 'none';
            this.viewElems.weatherSearchView.style.display = 'block';
            this.viewElems.searchInput.value = '';
        }
    }

    returnToSearch = () => {
        this.fadeInOut();
    
        setTimeout(() => {
            this.switchView();
            this.fadeInOut();
        }, 500);
    }

    displayWeatherData = data => {
        this.switchView();
        this.fadeInOut();
    
        const weather = data.consolidated_weather[0];
        console.log(weather);
    
        this.viewElems.weatherCity.innerText = data.title;
        this.viewElems.weatherIcon.src = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
        this.viewElems.weatherIcon.alt = weather.weather_state_name;
    
        const currTemp = weather.the_temp.toFixed(2);
        const maxTemp = weather.max_temp.toFixed(2);
        const minTemp = weather.min_temp.toFixed(2);

        const humidity = weather.humidity;

        const windDirection = weather.wind_direction_compass;
        const windSpeed = (weather.wind_speed * 0.62137).toFixed(2);
        const rotationSpeed = (30 / windSpeed).toFixed(2);

        const visibility = (weather.visibility * 0.62137).toFixed(2);
        const visibilityMountain = (visibility / 12).toFixed(2);
    
        this.viewElems.weatherCurrentTemp.innerText = `Temp ${currTemp} °C`;
        this.viewElems.weatherMaxTemp.innerText = `${maxTemp} °C`;
        this.viewElems.weatherMinTemp.innerText = `${minTemp} °C`;

        this.viewElems.humidity_info.innerText = `${humidity}%`;
        this.viewElems.humidity_data.style.strokeDashoffset = `calc(440 - (440 * ${humidity}) / 100)`

        this.viewElems.windDirection.innerText = `${windDirection}`;
        this.viewElems.windSpeed.innerText = `${windSpeed} km/h`;
        this.viewElems.airscrew1.style.animationDuration = `${rotationSpeed}s`;
        this.viewElems.airscrew2.style.animationDuration = `${rotationSpeed}s`;

        this.viewElems.weatherVisibility.innerText = `${visibility} km`;
        this.viewElems.mountainIcon.style.opacity = visibilityMountain;
    }
}

document.addEventListener('DOMContentLoaded', new WeatherApp());
