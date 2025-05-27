const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Plant Care Tracker')
})

app.listen(port, ()=>{
    console.log(`plant care server is running ${port}`)
    
})