import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [location, setLocation] = useState(true);
  const [city, setCity] = useState('...Loading');
  const [temp, setTemp] = useState();
  const [minTemp, setMinTemp] = useState();
  const [maxTemp, setMaxTemp] = useState();
  const [weather, setWeather] = useState('');

  const [days, setDays] = useState([]);
  const API_KEY = process.env.REACT_APP_API_KEY;

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: 5,
    });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    console.log(json);
    setTemp(json.main.temp);
    setMaxTemp(json.main.temp_max);
    setMinTemp(json.main.temp_min);
    setWeather(json.weather[0].main);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {/* <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View> */}
        {weather && temp && minTemp && maxTemp ? (
          <>
            <View style={styles.day}>
              <Text style={styles.description}>weather</Text>
              <Text style={styles.temp}>{weather}</Text>
            </View>
            <View style={styles.day}>
              <Text style={styles.description}>Temp</Text>
              <Text style={styles.temp}>{temp}</Text>
            </View>
            <View style={styles.day}>
              <Text style={styles.description}>Min.Temp</Text>
              <Text style={styles.temp}>{minTemp}</Text>
            </View>
            <View style={styles.day}>
              <Text style={styles.description}>Max.Temp</Text>
              <Text style={styles.temp}>{maxTemp}</Text>
            </View>
          </>
        ) : (
          <View style={styles.day}>
            <ActivityIndicator
              color={'white'}
              size={'large'}
              style={{ marginTop: 10 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weather: {},
  cityName: {
    fontSize: 68,
    fontWeight: '500',
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    fontSize: 120,
    marginTop: 50,
  },
  description: {
    fontSize: 60,
    // marginTop: -30,
  },
});
