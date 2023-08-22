import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:5000') // Replace with your actual API URL
      .then(response => {
        setTrains(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Train Information</h1>
      <ul>
        {trains.map((train, index) => (
          <li key={index}>
            <h2>{train.trainName}</h2>
            <p>Train Number: {train.trainNumber}</p>
            <p>Departure Time: {train.departureTime.Hours}:{train.departureTime.Minutes}:{train.departureTime.Seconds}</p>
            <p>Seats Available: Sleeper - {train.seatsAvailable.sleeper}, AC - {train.seatsAvailable.AC}</p>
            <p>Price: Sleeper - {train.price.sleeper}, AC - {train.price.AC}</p>
            <p>Delayed By: {train.delayedBy} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
