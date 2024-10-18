// core nodejs require
const express = require("express");
const path = require("path");
require("dotenv").config();
const http = require("http");
const url = require("url");
require("./db/db");
const cors = require("cors");
// import socket configure function
const configureWebSocket = require("./socket/index");
const cookieParser = require("cookie-parser")

//app require
const multiplayerRoute = require("./routes/http.route/multiplayerRoute");
const projects = require("./routes/http.route/projects");
const homepage = require("./routes/http.route/homepage");
const chatApp = require("../nodejs/routes/http.route/api");
// PORT
const PORT = process.env.PORT || 3000;

const app = express();
// const expressWs = require("express-ws")(app)
// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.frontend_uri
        : "http://localhost:5173", // Assuming your React app runs on 5173
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.resolve(__dirname, "public")));
// Add static serving for React build files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/dist')));
  }



app.use("/projects", projects);
app.use("/", homepage);

// app.use('projects/multiplayer',multiplayerRoute)
// React App Route - Serve index.html for all non-API routes in production
// if (process.env.NODE_ENV === 'production') {
//   app.get('*', (req, res) => {
//     // Exclude API and legacy routes
//     if (!req.path.startsWith('/api') && !req.path.startsWith('/legacy')) {
//       res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
//     }
//   });
// }


// WebSocket server

configureWebSocket(
  app.listen(PORT, () => {
    console.log(`Server listening in the port: ${PORT}`);
  })
);
