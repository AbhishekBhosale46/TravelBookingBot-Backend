const express = require("express");
const app = express();

const { WebhookClient } = require("dialogflow-fulfillment");

const hotelData = {
  Mumbai: ["Trident", "The Lalit Ashok", "Radisson Blu Plaza"],
  Goa: ["Park Hyatt", "Grand Hyatt", "Radiant"],
  Delhi: ["The Park", "Hyatt Regency", "ITC Grand Central"],
  Banglore: ["Radisson Blu", "Hyatt Novotel", "The Lalit"],
};

app.get("/", (req, res) => {
  res.send("Hi from server!");
});

app.post("/", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  const city = agent.contexts[0].parameters.city;
  const date = agent.contexts[0].parameters.date;
  const guests = agent.contexts[0].parameters.guests;

  function askdetails(agent) {
    if (city === "") {
      agent.add("Please tell me the city you want to travel");
    }
    if (date === "") {
      agent.add("Please tell me check-in date");
    }
    if (guests === "") {
      agent.add("Please tell me the number of guests");
    }
    if (city !== "" && date !== "" && guests !== "") {
      const hotels = hotelData[`${city}`];
      var msgstr = `These are the available hotels on ${date.slice(
        0,
        10
      )} in ${city} - \n`;

      hotels.forEach((element) => {
        msgstr += element + ", ";
      });

      msgstr += "Tell me the hotel name you want to book";

      agent.add(msgstr);
    }
  }

  const intentMap = new Map();
  intentMap.set("Ask Details", askdetails);
  agent.handleRequest(intentMap);
});

app.listen(8080, () => {
  console.log("server running...");
});
