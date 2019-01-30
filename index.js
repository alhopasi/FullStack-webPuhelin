const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body)
})

const morganLog = morgan(':method :url :status :res[content-length] - :response-time ms :data',
)

app.use(morganLog)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '045-1236543',
  },
  {
    id: 2,
    name: 'Arto Järvinen',
    number: '041-21423123',
  },
  {
    id: 3,
    name: 'Lea Kutvonen',
    number: '040-4323234',
  },
  {
    id: 4,
    name: 'Martti Tienari',
    number: '09-784232',
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const amount = persons.length
  const reply = ""
  response.send(`<p>Puhelinluettelossa ${amount} henkilön tiedot</p>
  <p>${new Date()}</p>`)

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (body.number === undefined) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  persons.map(n => {
    if (body.name == n.name) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  })

  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})