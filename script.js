// CONSTANTS;
const API_KEY = '1463c468fbd94653a4071402241112'
const REALTIME_URL = 'https://api.weatherapi.com/v1/forecast.json?key=';

// go to top
const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});

// Search functionality
const searchInput = document.querySelector(".search-bar");
const realTimeBtn = document.querySelector(".realtime-data-btn");
const ForecastBtn = document.querySelector(".forecast-btn");
const msg = document.getElementById("message");
let temp_c = true;
let current_location = false;
let realtime = true;

// fetching results
const printRealtime = (data) =>{
    let conditionIcon = data.current.condition.icon;
    conditionIcon = conditionIcon.slice(2, conditionIcon.length);
    document.getElementById("weather-container").style.backgroundImage = `url('https://${conditionIcon}')`

    let container = document.createElement("div");
    let time = document.createElement("p");
    let location = document.createElement("p");
    let current = document.createElement("p");
    let windSpeed = document.createElement("p");
    let humidity = document.createElement("p");
    let pressure = document.createElement("p");
    let temp = document.createElement("p");

    time.innerHTML = `Time: ${data.location.localtime}`
    location.innerHTML = `Location: ${data.location.name}, ${data.location.region}, ${data.location.country}
    (Lat: ${data.location.lat}, Lon: ${data.location.lon})`;
    current.innerHTML = `Condition: ${data.current.condition.text}`
    windSpeed.innerHTML = `Wind Speed: ${data.current.wind_mph} mph`;
    humidity.innerHTML = `Humidity: ${data.current.humidity}`;
    pressure.innerHTML = `Pressure: ${data.current.pressure_mb} millibars`;
    if(temp_c){
        temp.innerHTML = `Temperature: ${data.current.temp_c} C`
    }else{
        temp.innerHTML = `Temperature: ${data.current.temp_f} F`
    }

    let list = [time, location, current, windSpeed, humidity, pressure, temp];
    list.map((e)=>{
        container.appendChild(e);
    });
    msg.appendChild(container);
}

const printForcast = (data) => {
    document.getElementById("weather-container").style.backgroundImage = `url('assets/about-img.png')`
    let head = document.createElement("p");
    head.innerHTML = `Location: ${data.location.name}, ${data.location.region}, ${data.location.country}
    (Lat: ${data.location.lat}, Lon: ${data.location.lon})`;
    msg.appendChild(head);
    data.forecast.forecastday.map((e)=>{
        let child = document.createElement("div");
        let date = document.createElement("p");
        let maxtemp = document.createElement("p");
        let avgtemp = document.createElement("p");
        let mintemp = document.createElement("p");
        let windSpeed = document.createElement("p");
        let current = document.createElement("p");
        let humidity = document.createElement("p");

        date.innerHTML = `Date: ${e.date}`;
        if(temp_c){
            maxtemp.innerHTML = `Max Temp: ${e.day.maxtemp_c} C`;
            mintemp.innerHTML = `Max Temp: ${e.day.mintemp_c} C`;
            avgtemp.innerHTML = `Avg Temp: ${e.day.avgtemp_c} C`;
        }else{
            maxtemp.innerHTML = `Max Temp: ${e.day.maxtemp_f} F`;
            mintemp.innerHTML = `Max Temp: ${e.day.mintemp_f} F`;
            avgtemp.innerHTML = `Avg Temp: ${e.day.avgtemp_f} F`;
        }
        windSpeed.innerHTML = `Max wind speed: ${e.day.maxwind_mph} mph`;
        humidity.innerHTML = `Avg Humidity: ${e.day.avghumidity}`;
        current.innerHTML = `Condition: ${e.day.condition.text}`;

        let list = [date, maxtemp, mintemp, avgtemp, windSpeed, humidity, current];
        list.map((e)=>{
            child.appendChild(e);
        })

        msg.appendChild(child);
    })
}

const FetchRealtime = (location, days) => {
    msg.innerHTML = "";
    fetch(REALTIME_URL+`${API_KEY}&q=${location}&days=${days}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        current_location = data.location.name;
        if(days == 1) printRealtime(data);
        else printForcast(data);

    })
    .catch(err => {
        current_location = false;
        console.error(err);
        msg.innerHTML = "No such city found";
        document.getElementById("weather-container").style.backgroundImage = 'none'
    });
}

realTimeBtn.addEventListener('click', ()=>{
    realtime = true;
    FetchRealtime(searchInput.value, 1);
});

ForecastBtn.addEventListener('click', ()=>{
    realtime = false;
    FetchRealtime(searchInput.value, 7);
})

// temperature toggle button
const tempToggle = () => {
    let tempTogContainer = document.querySelector(".temp-toggle-subcontainer")
    let tempTogBtn = document.querySelector(".temp-toggle-btn");
    tempTogBtn.addEventListener('click', ()=>{
        if(tempTogBtn.innerHTML == 'C'){
            tempTogBtn.innerHTML = 'F';
            temp_c = false;
            tempTogContainer.style.justifyContent = 'flex-end'
            if(current_location){
                if(realtime){
                    FetchRealtime(current_location, 1);
                }
                else {
                    FetchRealtime(current_location, 7);
                }
            }
        }else{
            tempTogBtn.innerHTML = 'C';
            temp_c = true;
            tempTogContainer.style.justifyContent = 'flex-start'
            if(current_location){
                if(realtime){
                    FetchRealtime(current_location, 1);
                }
                else {
                    FetchRealtime(current_location, 7);
                }
            }
        }
    })
}


// calling functions
tempToggle()