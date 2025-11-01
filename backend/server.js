const express = require('express');
const app = express();
const https = require('https')
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const multer = require('multer')
const cookieParser = require("cookie-parser");
const path = require('path'); 
const fs = require('fs');
const PORT = 3000
const certPath = path.resolve(__dirname, '../localhost+2.pem');
const keyPath = path.resolve(__dirname, '../localhost+2-key.pem');

const { readdirSync } = require('fs');
dotenv.config();

app.use(cors(
  {
    origin: "http://localhost:5173",  // ระบุ origin ที่อนุญาต
    credentials: true                 // เปิดให้ส่ง cookies
  },{
    origin:"https://localhost:3000",
    credentials: true
  },
  {
    origin: "https://localhost:5173",  // ระบุ origin ที่อนุญาต
    credentials: true                 // เปิดให้ส่ง cookies
  }
));
app.use(express.json());    

app.use(cookieParser());

// app.use(multer)
app.use(morgan('dev'));

readdirSync('./routes').map((r)=>{
    const nameRoute = r.split('.')[0];
    app.use(`/api/${nameRoute}`, require('./routes/' + r));
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// https.createServer({
//     key: fs.readFileSync(keyPath),
//     cert: fs.readFileSync(certPath)
//   }, app).listen(3000, () => {
//     console.log('HTTPS server running on https://localhost:3000');
//   });