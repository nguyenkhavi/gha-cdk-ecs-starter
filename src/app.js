const express = require("express");
const app = express();

// Define routes for each port
app.get("/", (req, res) => {
  res.send(`Hello, this is ${req.headers.host}!`);
});

const ports = [80, 7007, 11011];

ports.forEach((port) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
