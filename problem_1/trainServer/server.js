const express = require('express');
const app = express();
const axios = require('axios');

const port = 5000;


const companyName ="amritrai";
const clientID ="e799de20-9a9e-4c6b-8674-6c8ec06c377b";
const clientSecret = "AsfGYzShcptJbESz";

const ownerName = "Amrit Rai";
const ownerEmail= "ar7577@srmist.edu.in";
const rollNo= "RA2011003030129";
app.use(express.json());


  // Extract clientID and clientSecret from the first response
  // const { clientID, clientSecret, companyName } = registerResponse.data;
// GET request that automatically takes the current time as input
app.get('/', async (req, res) => {
    const currentTime = new Date();
  
    try {
    //   // Call the first POST request to /register endpoint
    //   const registerResponse = await axios.post('http://20.244.56.144/train/register', {
    //     companyName: 'something'
    //   });
  
    //   // Extract clientID and clientSecret from the first response
    //   const { clientID, clientSecret, companyName } = registerResponse.data;
  
      // Call the second POST request to /auth endpoint
      const authResponse = await axios.post('http://20.244.56.144/train/auth', {
        companyName,
        clientID,
        ownerName,
        ownerEmail,
        rollNo,
        clientSecret
      });
  
      // Extract access_token from the second response
      const { token_type, access_token, expires_in } = authResponse.data;
  
      // Call the third GET request to /trains endpoint with authorization header
      const trainsResponse = await axios.get('http://20.244.56.144/train/trains', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
  
      // Filter the trains departing in the next 30 minutes
      const filteredTrains = trainsResponse.data.filter((train) => {
        const departureTime = new Date();
        departureTime.setHours(train.departureTime.Hours);
        departureTime.setMinutes(train.departureTime.Minutes);
        departureTime.setSeconds(train.departureTime.Seconds);
        return departureTime.getTime() > currentTime.getTime() + 30 * 60 * 1000;
      });
  
      // Sort the trains based on ascending order of price, descending order of tickets and descending order of departure time(after considering delays)
      const sortedTrains = filteredTrains.sort((train1, train2) => {
        // Sort based on price
        const price1 = Math.min(train1.price.sleeper, train1.price.AC);
        const price2 = Math.min(train2.price.sleeper, train2.price.AC);
        if (price1 !== price2) {
          return price1 - price2;
        }
  
        // Sort based on tickets
        const tickets1 = train1.seatAvailable.sleeper + train1.seatAvailable.AC;
        const tickets2 = train2.seatAvailable.sleeper + train2.seatAvailable.AC;
        if (tickets1 !== tickets2) {
          return tickets2 - tickets1;
        }
  
        // Sort based on departure time (after considering delays)
        const departureTime1 = new Date();
        departureTime1.setHours(train1.departureTime.Hours);
        departureTime1.setMinutes(train1.departureTime.Minutes);
        departureTime1.setSeconds(train1.departureTime.Seconds);
        departureTime1.setMinutes(departureTime1.getMinutes() + train1.delayedBy);
  
        const departureTime2 = new Date();
        departureTime2.setHours(train2.departureTime.Hours);
        departureTime2.setMinutes(train2.departureTime.Minutes);
        departureTime2.setSeconds(train2.departureTime.Seconds);
        departureTime2.setMinutes(departureTime2.getMinutes() + train2.delayedBy);
  
        return departureTime1.getTime() - departureTime2.getTime();
      });
  
      // Send the sorted trains to the client as a response
      res.status(200).send(sortedTrains);
  
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send('Server error');
  }
});

// start the server
app.listen(port, () => console.log(`Server started on port ${port}`));