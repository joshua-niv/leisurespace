// 使用纯免费 API 的替代方案
function getLocation() {
    const locationElement = document.getElementById('location');
    
    // 使用更可靠的 IP 定位服务
    fetch('https://api.ipapi.is/')
        .then(response => response.json())
        .then(data => {
            // 使用城市名称
            const city = data.location.city || '未知位置';
            locationElement.textContent = city;
            
            // 获取位置后获取天气
            getWeather(data.location.latitude, data.location.longitude);
        })
        .catch(error => {
            console.error('获取位置信息失败:', error);
            // 备用 IP 定位服务
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    locationElement.textContent = data.city || '未知位置';
                    getWeather(data.latitude, data.longitude);
                })
                .catch(err => {
                    console.error('备用定位失败:', err);
                    locationElement.textContent = '未知位置';
                    // 使用默认坐标获取天气（比如北京）
                    getWeather(39.9042, 116.4074);
                });
        });
}

function getWeather(lat, lon) {
    const temperatureElement = document.getElementById('temperature');
    const weatherDescElement = document.getElementById('weather-description');
    const weatherIconElement = document.getElementById('weather-icon');
    
    // 使用 wttr.in（完全免费）
    fetch(`https://wttr.in/${lat},${lon}?format=j1&lang=zh`)
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.current_condition[0].temp_C);
            const description = data.current_condition[0].lang_zh[0].value;
            
            temperatureElement.textContent = `${temp}°C`;
            weatherDescElement.textContent = description;
            
            // 设置天气图标
            const weatherCode = data.current_condition[0].weatherCode;
            setWeatherIconByCode(weatherCode, weatherIconElement);
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

// 备用天气图标设置函数
function setWeatherIconByCode(code, iconElement) {
    // 移除所有现有的类，只保留基础类
    iconElement.className = 'fas';
    
    // wttr.in 天气代码映射
    if (code < 200) {
        iconElement.classList.add('fa-sun'); // 晴天
    } else if (code < 300) {
        iconElement.classList.add('fa-cloud-sun'); // 部分多云
    } else if (code < 500) {
        iconElement.classList.add('fa-cloud'); // 多云
    } else if (code < 600) {
        iconElement.classList.add('fa-cloud-rain'); // 雨
    } else if (code < 700) {
        iconElement.classList.add('fa-snowflake'); // 雪
    } else {
        iconElement.classList.add('fa-cloud'); // 默认多云
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取位置和天气信息
    getLocation();
}); 