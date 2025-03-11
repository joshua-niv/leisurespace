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

// 获取位置信息 - 使用更简单的方法
function getLocation() {
    const locationElement = document.getElementById('location');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 简化处理：直接使用IP地理位置API
                fetch('https://ipapi.co/json/')
                    .then(response => response.json())
                    .then(data => {
                        // 使用城市名称
                        const city = data.city || '未知位置';
                        locationElement.textContent = city;
                        
                        // 获取位置后获取天气
                        getWeather(data.latitude, data.longitude);
                    })
                    .catch(error => {
                        console.error('获取位置信息失败:', error);
                        locationElement.textContent = '无法获取位置';
                        
                        // 使用备用方法：使用浏览器获取的坐标直接获取天气
                        getWeather(position.coords.latitude, position.coords.longitude);
                    });
            },
            (error) => {
                console.error('获取位置失败:', error);
                locationElement.textContent = '位置访问被拒绝';
                
                // 尝试使用IP地址获取大致位置
                fetch('https://ipapi.co/json/')
                    .then(response => response.json())
                    .then(data => {
                        locationElement.textContent = data.city || '未知位置';
                        getWeather(data.latitude, data.longitude);
                    })
                    .catch(err => {
                        console.error('IP定位失败:', err);
                    });
            }
        );
    } else {
        locationElement.textContent = '您的浏览器不支持地理位置';
    }
}

// 获取天气信息 - 使用免费API
function getWeather(lat, lon) {
    const temperatureElement = document.getElementById('temperature');
    const weatherDescElement = document.getElementById('weather-description');
    const weatherIconElement = document.getElementById('weather-icon');
    
    // 使用OpenWeatherMap API获取天气 - 使用免费API密钥
    const OPENWEATHER_API_KEY = '4d8fb5b93d4af21d66a2948710284366'; // 这是一个示例密钥，可能需要更换
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}&lang=zh_cn`)
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
            
            // 尝试使用备用天气API
            fetch(`https://wttr.in/${lat},${lon}?format=j1`)
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
                .catch(err => {
                    console.error('备用天气API失败:', err);
                });
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
    // 立即更新一次时间
    updateTime();
    
    // 每秒更新一次时间
    setInterval(updateTime, 1000);
    
    // 获取位置和天气信息
    getLocation();
}); 