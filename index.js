// // core nodejs require
// const express = require("express");
// const path = require("path");
// require("dotenv").config();
// const http = require("http");
// const url = require("url");
// require("./db/db");
// const cors = require("cors");
// // import socket configure function
// const configureWebSocket = require("./socket/index");
// const cookieParser = require("cookie-parser")

// //app require
// const multiplayerRoute = require("./routes/http.route/multiplayerRoute");
// const projects = require("./routes/http.route/projects");
// const homepage = require("./routes/http.route/homepage");
// const chatApp = require("../nodejs/routes/http.route/api");
// // PORT
// const PORT = process.env.PORT || 3000;

// const app = express();
// // const expressWs = require("express-ws")(app)
// // Middleware
// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === "production"
//         ? process.env.frontend_uri
//         : "http://localhost:5173", // Assuming your React app runs on 5173
//     credentials: true,
//   })
// );
// app.use(cookieParser());
// app.use(express.json());


// app.set("view engine", "ejs");
// app.set('views', path.join(__dirname, 'views'));



// app.use(express.static(path.resolve(__dirname, "public")));
// app.use("/projects", projects);
// app.use("/", homepage);

// // app.use('projects/multiplayer',multiplayerRoute)


// // WebSocket server

// configureWebSocket(
//   app.listen(PORT, () => {
//     console.log(`Server listening in the port: ${PORT}`);
//   })
// );
const express = require("express");
const path = require("path");
require("dotenv").config();
require("./db/db");
const cors = require("cors");
const configureWebSocket = require("./socket/index");
const cookieParser = require("cookie-parser");

const projects = require("./routes/http.route/projects");
const homepage = require("./routes/http.route/homepage");

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? process.env.frontend_uri
      : "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// View engine setup
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Static files for the chat app
if (process.env.NODE_ENV === 'production') {
  app.use("/projects/chat-app", express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, filepath) => {
      if (filepath.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      } else if (filepath.endsWith('.mjs')) {
        res.set('Content-Type', 'application/javascript');
      } else if (filepath.endsWith('.css')) {
        res.set('Content-Type', 'text/css');
      }
    }
  }));
}

// Other static files
app.use(express.static(path.resolve(__dirname, "public")));

// Routes
app.use("/projects", projects);
app.use("/", homepage);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server listening in the port: ${PORT}`);
});

// Configure WebSocket
configureWebSocket(server);