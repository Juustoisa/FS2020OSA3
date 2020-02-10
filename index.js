const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())


morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

app.use(morgan(':method :url[req] :status :res[content-length] - :response-time ms :body',{
    skip: function (req) {return req.method !== "POST"}
}));

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1,
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2,
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3,
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4,
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send('<p>Phonebook has info for ' + persons.length +
        ' people</br></br>Fetched: ' + new Date().toLocaleString() + '</p>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.send(person.number)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'Name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'Number missing'
        })
    }

    if(persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * Math.floor(10000000)),
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})