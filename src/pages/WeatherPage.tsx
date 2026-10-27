import axios from 'axios';
import { useState } from 'react';
import { Button, Input } from '@/components';

interface WeatherData {
  city: string;
  wind: string;
  humidity: number | null;
  temp: number | null;
  description: string;
  icon: string;
}

const createWeatherData = (
  city = '',
  wind = '',
  humidity: number | null = null,
  temp: number | null = null,
  description = '',
  icon = '',
): WeatherData => ({ city, wind, humidity, temp, description, icon });

const WeatherPage = (): React.ReactNode => {
  const [weatherInfo, setWeatherInfo] = useState<WeatherData>(createWeatherData());

  const getWeather = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const city = formData.get('city') as string;

    if (!city) {
      return;
    }

    try {
      const res = await axios.get(
        import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: city,
            appid: import.meta.env.VITE_WEATHER_API_KEY,
          },
        },
      );

      const info = res.data;
      setWeatherInfo(
        createWeatherData(
          city,
          info.wind.speed,
          info.main.humidity,
          Math.round(info.main.temp - 273.15),
          info.weather[0].description,
          info.weather[0].icon,
        ),
      );
    } catch {
      setWeatherInfo(createWeatherData());
    }
  };

  return (
    <div className="mx-auto flex min-h-main w-full max-w-[768px] flex-col space-y-lg">
      <h1 className="title-2xl">Weather Api</h1>

      <form onSubmit={getWeather} className="flex gap-lg">
        <Input name="city" inputSize="large" placeholder="輸入城市名稱..." />
        <Button type="submit">Search</Button>
      </form>

      {!!weatherInfo.city && (
        <div className="overflow-hidden rounded-md border border-outline-2 bg-surface-1 shadow-light-down-3 md:flex">
          <div className="relative h-[200px] w-[200px] shrink-0 overflow-hidden">
            <img
              className="h-full w-full object-contain"
              src={`${import.meta.env.VITE_WEATHER_ICON_BASE_URL || 'https://openweathermap.org/img/wn'}/${weatherInfo.icon}@4x.png`}
              alt="weatherIcon"
              width={200}
              height={200}
            />
          </div>
          <div className="flex flex-wrap">
            <div className="flex h-full flex-col p-lg text-left sm:p-2xl">
              <h3 className="title-lg">{weatherInfo.city}</h3>
              <p className="mb-md text-xs text-on-surface-variant">{weatherInfo.description}</p>
              <p className="mt-xs text-on-surface-variant">溫度：{weatherInfo.temp}°C</p>
              <p className="mt-xs text-on-surface-variant">濕度：{weatherInfo.humidity}</p>
              <p className="mt-xs text-on-surface-variant">風速：{weatherInfo.wind}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
