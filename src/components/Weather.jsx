import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'

const Weather = () => {
    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false)
    const [loading, setLoading] = useState(false)
    const [backgroundStyle, setBackgroundStyle] = useState({
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))'
    })

    const allIcons = {
        "01d": { icon: clear_icon, color: 'rgba(251, 191, 36, 0.9)' },
        "01n": { icon: clear_icon, color: 'rgba(30, 58, 138, 0.9)' },
        "02d": { icon: cloud_icon, color: 'rgba(148, 163, 184, 0.9)' },
        "02n": { icon: cloud_icon, color: 'rgba(51, 65, 85, 0.9)' },
        "03d": { icon: cloud_icon, color: 'rgba(100, 116, 139, 0.9)' },
        "03n": { icon: cloud_icon, color: 'rgba(30, 41, 59, 0.9)' },
        "04d": { icon: drizzle_icon, color: 'rgba(96, 165, 250, 0.9)' },
        "04n": { icon: drizzle_icon, color: 'rgba(30, 64, 175, 0.9)' },
        "09d": { icon: rain_icon, color: 'rgba(59, 130, 246, 0.9)' },
        "09n": { icon: rain_icon, color: 'rgba(37, 99, 235, 0.9)' },
        "10d": { icon: rain_icon, color: 'rgba(29, 78, 216, 0.9)' },
        "10n": { icon: rain_icon, color: 'rgba(30, 64, 175, 0.9)' },
        "13d": { icon: snow_icon, color: 'rgba(186, 230, 253, 0.9)' },
        "13n": { icon: snow_icon, color: 'rgba(125, 211, 252, 0.9)' },
    }

    const updateBackground = (weatherCondition) => {
        const colors = {
            'clear': 'linear-gradient(135deg, rgba(251, 191, 36, 0.8), rgba(245, 158, 11, 0.8))',
            'clouds': 'linear-gradient(135deg, rgba(148, 163, 184, 0.8), rgba(100, 116, 139, 0.8))',
            'rain': 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8))',
            'drizzle': 'linear-gradient(135deg, rgba(96, 165, 250, 0.8), rgba(59, 130, 246, 0.8))',
            'snow': 'linear-gradient(135deg, rgba(186, 230, 253, 0.8), rgba(125, 211, 252, 0.8))',
            'thunderstorm': 'linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(67, 56, 202, 0.8))',
            'default': 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))'
        }

        const weatherType = weatherCondition?.toLowerCase() || 'default'
        setBackgroundStyle({
            background: colors[weatherType] || colors.default
        })
    }

    const search = async (city) => {
        if (city === "") {
            alert("Enter city Name");
            return;
        }
        try {
            setLoading(true)
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                setLoading(false)
                return;
            }

            console.log(data);
            const weatherIcon = data.weather[0].icon;
            const iconData = allIcons[weatherIcon] || { icon: clear_icon, color: 'rgba(59, 130, 246, 0.9)' };
            
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                country: data.sys.country,
                feelsLike: Math.floor(data.main.feels_like),
                pressure: data.main.pressure,
                description: data.weather[0].description,
                icon: iconData.icon,
                weatherCondition: data.weather[0].main
            })
            
            updateBackground(data.weather[0].main)
        } catch (error) {   
            setWeatherData(false);
            console.error("Error in fetching weather data:", error.message);
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        search("London");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='weather' style={backgroundStyle}>
            <div className="search-bar">
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder="Enter city name..."
                    onKeyPress={(e) => e.key === 'Enter' && search(inputRef.current.value)}
                />
                <div className="search-button" onClick={() => search(inputRef.current.value)}>
                    <img src={search_icon} alt="Search"/>
                </div>
            </div>
            
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading weather data...</p>
                </div>
            ) : weatherData ? (
                <>
                    <div className="weather-header">
                        <div className="location-info">
                            <p className='location'>{weatherData.location}, {weatherData.country}</p>
                            <p className="description">{weatherData.description}</p>
                        </div>
                    </div>
                    
                    <div className="main-weather">
                        <div className="temperature-container">
                            <p className='temperature'>{weatherData.temperature}°C</p>
                            <p className="feels-like">Feels like {weatherData.feelsLike}°C</p>
                        </div>
                        <img src={weatherData.icon} alt="" className='weather-icon'/>
                    </div>
                    
                    <div className="weather-data">
                        <div className="data-card">
                            <div className="card-header">
                                <img src={humidity_icon} alt="Humidity"/>
                                <span>Humidity</span>
                            </div>
                            <p className="data-value">{weatherData.humidity}%</p>
                        </div>
                        
                        <div className="data-card">
                            <div className="card-header">
                                <img src={wind_icon} alt="Wind"/>
                                <span>Wind</span>
                            </div>
                            <p className="data-value">{weatherData.windSpeed} km/h</p>
                        </div>
                    </div>
                    
                    <div className="additional-info">
                        <div className="info-item">
                            <span className="info-label">Pressure</span>
                            <span className="info-value">{weatherData.pressure} hPa</span>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default Weather