const port = 3003;

const express = require('express');
const server = express();
//const cors = require('cors');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

//const router = require('./routes');

server.use(express.urlencoded({ extended: true}));
server.use(express.json());


runDB();

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório."
mongoose.Error.messages.Number.min = 
    "O '{VALUE}' informado é menor que o limite mínimo de '{MIN}'."
mongoose.Error.messages.Number.max = 
    "O '{VALUE}' informado é maior que o limite máximo de '{MAX}'."
mongoose.Error.messages.String.enum = 
    "'{VALUE}' não é válido para o atributo '{PATH}'."

async function runDB() {
    await mongoose.connect(
        'mongodb://localhost/mymoney',
        { useNewUrlParser: true, useUnifiedTopology: true } 
    );
}

requireDir('./models');

server.use('/api', require('./routes'));

server.listen(port, function() {
    console.log(`Backend is running on port ${port}.`);
});