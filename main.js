const link = "http://api.weatherapi.com/v1/current.json?key=8b684208e7b74e8592c102618231904";

const root = document.getElementById("root");
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");
const close = document.getElementById("close");

let store = {
    city: "Tashkent",
    temp_c: 0,
    localtime: "00:00",
    is_day: 0,
    text: "",
    properties: {
        cloud: {},
        humidity: {},
        wind_kph: {},
        vis_km: {},
        pressure_mb: {},
        uv: {},
    }
};


const fetchData = async () => {
    try {
        const result = await fetch(`${link}&q=${store.city}&aqi=no`);
        const data = await result.json();
    
        const {
            current: {  cloud,
                        temp_c: tempC, 
                        humidity,
                        pressure_mb: pressureMb,
                        uv,
                        vis_km: visKm,
                        is_day: isDay,
                        condition: { text },
                        wind_kph: windKph
                    },
            location: { localtime },
        } = data;
    
        store = {
            ...store,
            tempC,
            localtime,
            isDay,
            text,
            properties: {
                cloud: {
                    title: 'cloudy',
                    value: `${cloud} %`,
                    icon: "cloud.png"
                },
                humidity: {
                    title: 'humidity',
                    value: `${humidity} %`,
                    icon: "humidity.png"
                },
                windKph: {
                    title: 'wind speed',
                    value: `${windKph} km/h`,
                    icon: "wind.png"
                },
                visKm: {
                    title: 'visibility',
                    value: `${visKm} km`,
                    icon: "visibility.png"
                },
                pressureMb: {
                    title: 'pressure',
                    value: `${pressureMb} mm Hg`,
                    icon: "gauge.png"
                },
                uv: {
                    title: 'uv Index',
                    value: `${uv}`,
                    icon: "uv-index.png"
                },
            }
        };
    
        console.log('data', data);
    
        renderComponent();   
    } catch (err) {
        console.log(err);
    }
};


/*==================== GET IMAGE BY WEATHER DESCRIPTION ====================*/
const getImage = (text) => {
    const value = text.toLowerCase();

    switch (value) {
        case "partly cloudy":
            return 'partly.png';
        case "fog":
            return 'fog.png';
        case "sunny":
            return 'sunny.png';
        case "cloud":
            return 'cloud.png';
        case "clear":
            return 'clear.png';
        default:
            return 'the.png';
    }
};


/*==================== RENDERING PROPERTY ====================*/
const renderProperty = (properties) => {
    return Object.values(properties).map(({title, value, icon}) => {
        return `
            <div class="property">
                <div class="property-icon">
                    <img src="./img/icons/${icon}" alt="">
                </div>
                <div class="property-info">
                    <div class="property-info__value">${value}</div>
                    <div class="property-info__description">${title}</div>
                </div>
            </div>`
    }).join('');
};


const markup = () => {
    const { city, text, localtime, tempC, isDay, properties } = store;

    /*======== DAY OR NIGHT ========*/
    const containerClass = isDay === 1 ? 'is-day' : '';

    return `
    <div class="container ${containerClass}">
        <div class="top">
            <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                <div class="city-title" id="city">
                    <span>${city}</span>
                </div>
            </div>
            <div class="city-info">
                <div class="top-left">
                    <img class="icon" src="./img/${getImage(text)}" alt="">
                    <div class="description">${text}</div>
                </div>

                <div class="top-right">
                    <div class="city-info__subtitle">as of ${localtime.split(' ')[1]}</div>
                    <div class="city-info__title">${tempC}°</div>
                </div>
            </div>
        </div>
        <div id="properties">${renderProperty(properties)}</div>
    </div>
    `
};

const togglePopupClass = () => {
    popup.classList.toggle("active");
};

const renderComponent = () => {
    root.innerHTML = markup();

    const city = document.getElementById("city");
    city.addEventListener("click", togglePopupClass);
};

const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value
    };
};

const handleSubmit = (e) => {
    e.preventDefault();

    if (!store.city) return null;

    fetchData();
    togglePopupClass();
};

form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);
close.addEventListener("click", togglePopupClass);

fetchData();