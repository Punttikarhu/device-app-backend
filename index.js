const express = require('express')
const cors = require('cors')
const { Gpio } = require('pigpio')
require('dotenv').config()

const device = new Gpio(17, {mode: Gpio.OUTPUT})

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

var status = 'off'
var pulseInterval

app.get('/status', (req, res) => {
	res.send({ 'status': status })
	res.end()
})

app.post('/', (req, res) => {
  const data = req.body
  if (data.status === 'on') {
		
		clearInterval(pulseInterval)
		device.pwmWrite(data.pwm)
		status = 'on'

  } if (data.status === 'off') {
		
		clearInterval(pulseInterval)
		device.digitalWrite(0)
		status = 'off'

  }  if (data.status === 'start') {

		clearInterval(pulseInterval)
		status = 'off, waiting for timer'

  }  if (data.status === 'pulse') {

		pulseInterval = setInterval(pulse, Number(data.interval))
		status = 'on'
	
	}  if (data.status === 'send') {
		
		console.log(data.message)
 
	} 

  res.end()
})

const pulse = () => {
	if (device.digitalRead() === 0) {
		
		device.digitalWrite(1)
		status = 'on'

 	} else { 
		device.digitalWrite(0)
	}
}

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

// "start": "node index.js"
// npm install express --save
// npm install --save-dev nodemon
// "dev": "nodemon index.js"
// npm install cors --save
