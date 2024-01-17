import 'dotenv/config'
import express from "express";
import cors from "cors";

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

  //auth routes
import authRoutes from './routes/AuthRoutes.js'
import adminUserRoutes from './routes/AdminUserRoutes.js'
  app.use('/api/user/', authRoutes);
  app.use('/api/admin/', adminUserRoutes);

// simple route
app.get("/", (req, res) => {
  res.json(`Server is running on port ${PORT}.`);
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});