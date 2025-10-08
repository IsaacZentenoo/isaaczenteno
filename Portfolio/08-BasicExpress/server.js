const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html') 
})
app.post('/', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    const bmi = (weight / (height*height)*10000);
    res.send('Your BMI is ' + bmi);
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})