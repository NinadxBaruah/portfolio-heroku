const express = require("express");
const path = require("path");
<<<<<<< HEAD
const bodyParser = require('body-parser')
=======
>>>>>>> d7ed9e52fc5ee44a4aefece0e255f321b89cf92d
const fs = require("fs");
require("dotenv").config();
require("./db/db");
const cors = require("cors");
const configureWebSocket = require("./socket/index");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
<<<<<<< HEAD
// const connectDB2 = require("./db/db2");
=======

>>>>>>> d7ed9e52fc5ee44a4aefece0e255f321b89cf92d
const projects = require("./routes/http.route/projects");
const homepage = require("./routes/http.route/homepage");

const PORT = process.env.PORT || 3000;
const app = express();
<<<<<<< HEAD
app.use(bodyParser.urlencoded({ extended: false }))
// connectDB2();
=======

>>>>>>> d7ed9e52fc5ee44a4aefece0e255f321b89cf92d
// Trust the first proxy
app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://ninadbaruah.me" // Use exact domain
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// // Ensure temp directory exists
// const tempDir = path.join(__dirname, "uploads", "temp");
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }

// Configure express-fileupload with memory efficient options
<<<<<<< HEAD
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: path.join(__dirname, "uploads", "temp"),
//     limits: {
//       fileSize: 5 * 1024 * 1024, // 5MB limit
//       files: 1, // Allow only 1 file upload at a time
//     },
//     abortOnLimit: true,
//     debug: false,
//   }) 
// );

app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
=======
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "uploads", "temp"),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 1, // Allow only 1 file upload at a time
    },
    abortOnLimit: true,
    debug: false,
  })
);
>>>>>>> d7ed9e52fc5ee44a4aefece0e255f321b89cf92d

// Add these headers explicitly
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(cookieParser());
app.use(express.json());

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files for the chat app
if (process.env.NODE_ENV === "production") {
  app.use(
    "/projects/chat-app",
<<<<<<< HEAD
    express.static(path.join(__dirname, "dist"),
     {
=======
    express.static(path.join(__dirname, "dist"), {
>>>>>>> d7ed9e52fc5ee44a4aefece0e255f321b89cf92d
      setHeaders: (res, filepath) => {
        if (filepath.endsWith(".js")) {
          res.set("Content-Type", "application/javascript");
        } else if (filepath.endsWith(".mjs")) {
          res.set("Content-Type", "application/javascript");
        } else if (filepath.endsWith(".css")) {
          res.set("Content-Type", "text/css");
        }
      },
    })
  );
<<<<<<< HEAD

  app.use('/projects/react-intern', express.static(path.join(__dirname, 'react-intern-build')));
  app.use('/projects/intern/3', express.static(path.join(__dirname, 'react-intern-build2')));
  app.use('/projects/intern/4', express.static(path.join(__dirname, 'react-intern-build3')));

=======
>>>>>>> d7ed9e52fc5ee44a4aefece0e255f321b89cf92d
}

// Other static files
app.use(express.static(path.resolve(__dirname, "public")));

// Routes
<<<<<<< HEAD
app.get('/resume',(req,res) =>{
  res.render('resume')
})
=======
>>>>>>> d7ed9e52fc5ee44a4aefece0e255f321b89cf92d
app.use("/projects", projects);
app.use("/", homepage);

// 404 Page Not Found route
app.use((req, res, next) => {
  res.status(404).render("not-found", { title: "Page Not Found" });
});
// Start server
const server = app.listen(PORT, () => {
  console.log(`Server listening in the port: ${PORT}`);
});

// Configure WebSocket
configureWebSocket(server);
