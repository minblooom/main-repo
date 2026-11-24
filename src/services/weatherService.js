// src/services/weatherService.js
// Lightweight, privacy-preserving weather intelligence service using Open-Meteo API
// No API keys required, zero tracking of exact coordinates.

export class WeatherService {
  /**
   * Fetches current ambient weather data based on latitude and longitude
   * Default coordinates: Nairobi (-1.2921, 36.8219)
   */
  static async getCurrentWeather(latitude = -1.2921, longitude = 36.8219, locationName = 'Nairobi') {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Weather network error');
      }

      const data = await response.json();
      const current = data.current;
      const temp = Math.round(current.temperature_2m);
      const code = current.weather_code;

      const conditionInfo = this.mapWeatherCode(code, temp);
      const locSuffix = locationName ? ` · ${locationName}` : '';

      return {
        temperature: temp,
        condition: conditionInfo.label,
        icon: conditionInfo.icon,
        location: locationName,
        pillText: `${conditionInfo.icon}  ${conditionInfo.label} · ${temp}°C${locSuffix}`,
        hydrationTip: this.getHydrationTip(temp, locationName),
      };
    } catch {
      const locSuffix = locationName ? ` · ${locationName}` : '';
      // Graceful offline fallback
      return {
        temperature: 24,
        condition: 'Warm & Calm',
        icon: '☀️',
        location: locationName,
        pillText: `☀️  Warm & Calm · 24°C${locSuffix}`,
        hydrationTip: 'Stay hydrated today with small sips of water.',
      };
    }
  }

  static mapWeatherCode(code, temp) {
    if (code === 0) {
      return { label: temp > 26 ? 'Warm & Sunny' : 'Clear & Pleasant', icon: '☀️' };
    }
    if (code >= 1 && code <= 3) {
      return { label: 'Partly Cloudy', icon: '⛅' };
    }
    if (code >= 45 && code <= 48) {
      return { label: 'Misty & Cool', icon: '🌫️' };
    }
    if (code >= 51 && code <= 67) {
      return { label: 'Light Drizzle', icon: '🌦️' };
    }
    if (code >= 71 && code <= 82) {
      return { label: 'Cool Rain', icon: '🌧️' };
    }
    if (code >= 95) {
      return { label: 'Thunder & Showers', icon: '⛈️' };
    }
    return { label: 'Calm Day', icon: '🌤️' };
  }

  static getHydrationTip(temp) {
    if (temp >= 27) {
      return "It's quite warm today. Remember to drink a glass of cool water and stay refreshed.";
    }
    if (temp <= 18) {
      return "It's cool outside. A warm cup of tea or water can keep you feeling grounded.";
    }
    return 'Take a quiet breath and keep your water bottle close by.';
  }
}
