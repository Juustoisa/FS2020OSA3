const mongoose = require('mongoose')

if (process.argv.length < 2) {
    console.log('give password as argument')
    process.exit(1)
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', personSchema)
const password = process.argv[2]
const url =
    `mongodb+srv://FS20Juustoisa:${password}@cluster0-alqxe.mongodb.net/Phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

if (process.argv.length < 4) {

    console.log('phonebook:')
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact.name, contact.number)
        })
        mongoose.connection.close()
    })
} else {

    const newPersonName = process.argv[3]
    const newPersonNumber = process.argv[4]

    const contact = new Contact({
        name: newPersonName,
        number: newPersonNumber,
    })

    contact.save().then(response => {
        console.log('added ' + newPersonName + ' number ' + newPersonNumber + ' to phonebook!');
        mongoose.connection.close();
    })

}
