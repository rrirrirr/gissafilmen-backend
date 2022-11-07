const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
let highScoreList = []
let requestedDaily = new Set()
let seed = ''
let date = ''

app.set('trust proxy', true)

app.use(
  cors({
    origin: '*',
  })
)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/dailyseed', async (req, res) => {
  console.log(req.ip)
  if (requestedDaily.has(req.ip)) {
    res.send(JSON.stringify('no'))
    return
  }
  try {
    res.send(JSON.stringify(seed))
    requestedDaily.add(req.ip)
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
    const data = req.body
    console.log(data)
    if (data?.seed !== seed) {
      res.status(403).send({ error: 'Forbidden' })
      return
    }
    highScoreList.push({ name: data.name, score: data.score })
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
    requestedDaily = new Set()
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

