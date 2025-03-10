// 更新当前时间的函数
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    
    // 格式化时间为 HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// 获取位置信息
function getLocation() {
    const locationElement = document.getElementById('location');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 使用经纬度获取城市名称
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // 使用OpenCage Geocoding API获取城市名称
                fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=YOUR_OPENCAGE_API_KEY`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.results && data.results.length > 0) {
                            const city = data.results[0].components.city || 
                                         data.results[0].components.town || 
                                         data.results[0].components.county || 
                                         '未知位置';
                            locationElement.textContent = city;
                            
                            // 获取位置后获取天气
                            getWeather(lat, lon);
                        }
                    })
                    .catch(error => {
                        console.error('获取位置信息失败:', error);
                        locationElement.textContent = '无法获取位置';
                    });
            },
            (error) => {
                console.error('获取位置失败:', error);
                locationElement.textContent = '位置访问被拒绝';
            }
        );
    } else {
        locationElement.textContent = '您的浏览器不支持地理位置';
    }
}

// 获取天气信息
function getWeather(lat, lon) {
    const temperatureElement = document.getElementById('temperature');
    const weatherDescElement = document.getElementById('weather-description');
    const weatherIconElement = document.getElementById('weather-icon');
    
    // 使用OpenWeatherMap API获取天气
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=YOUR_OPENWEATHER_API_KEY`)
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.main.temp);
            const description = data.weather[0].description;
            const weatherId = data.weather[0].id;
            
            temperatureElement.textContent = `${temp}°C`;
            weatherDescElement.textContent = description;
            
            // 根据天气ID设置对应的图标
            setWeatherIcon(weatherId, weatherIconElement);
        })
        .catch(error => {
            console.error('获取天气信息失败:', error);
            temperatureElement.textContent = '--°C';
            weatherDescElement.textContent = '无法获取天气';
        });
}

// 根据天气ID设置对应的图标
function setWeatherIcon(weatherId, iconElement) {
    // 移除所有现有的类，只保留基础类
    iconElement.className = 'fas';
    
    // 根据OpenWeatherMap的天气代码设置图标
    // https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) {
        iconElement.classList.add('fa-bolt'); // 雷暴
    } else if (weatherId >= 300 && weatherId < 400) {
        iconElement.classList.add('fa-cloud-rain'); // 小雨
    } else if (weatherId >= 500 && weatherId < 600) {
        iconElement.classList.add('fa-cloud-showers-heavy'); // 大雨
    } else if (weatherId >= 600 && weatherId < 700) {
        iconElement.classList.add('fa-snowflake'); // 雪
    } else if (weatherId >= 700 && weatherId < 800) {
        iconElement.classList.add('fa-smog'); // 雾
    } else if (weatherId === 800) {
        iconElement.classList.add('fa-sun'); // 晴天
    } else if (weatherId > 800) {
        iconElement.classList.add('fa-cloud'); // 多云
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 立即更新一次时间
    updateTime();
    
    // 每秒更新一次时间
    setInterval(updateTime, 1000);
    
    // 获取位置和天气信息
    getLocation();
}); 