const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
let highScoreList = []
let seed = ''
let date = ''


app.use(
  cors({
    origin: '*',
  })
)

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/dailyseed', async (req, res) => {
  try {
    res.send(JSON.stringify(seed))
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Something failed!' })
  }
})

app.get('/score', async (req, res) => {
  try {
    res.send(JSON.stringify(highScoreList))
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Something failed!' })
  }
})

app.post('/score', (req, res) => {
  try {
    const score = req.body
    highScoreList.push(score)
    res.send(JSON.stringify(highScoreList))
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Something failed!' })
  }
})

const dailyUpdate = () => {
  const today = new Date().toDateString()
  highScoreList = highScoreList.sort(sortScore)
  if (date !== today) {
    seed = generateSeed()
    console.log(`new seed: ${seed} - ${today}`)
    date = today
    highScoreList = []
  }
}

const generateSeed = () => {
  return Math.random().toString(16).split('.')[1].slice(0, 8)
}

const sortScore = (a, b) => {
  return b.score - a.score
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  dailyUpdate()
  setInterval(dailyUpdate, 3600000);
})

