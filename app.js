require("dotenv").config();
require("./config/db")
const express = require("express")
const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 8000;



const morgan = require('morgan');
const dashboardRouter = require("./routes/dashboardRouter");



// importan middlewares
app.use(cors());
app.use(express.static('/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/public', { maxAge: '30 days' }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(morgan('tiny'));






app.get("/", async (req, res) => {
    res.status(200).json({ Success: true, error: "Server is running !" })
  })


app.use("/api/admin/" , dashboardRouter)
  
  app.listen(PORT, () => {
    console.log(`Server is running  on :  http://localhost:${PORT}`)
  })