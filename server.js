require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIEDATA = require('./movies-data.json')
//console.log(process.env.API_TOKEN)
const app = express();
const cors = require('cors')
const helmet = require('helmet')

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())



app.use(validateBearerToken = (req, res, next) => {
const authToken = req.get('Authorization');
const apiToken = process.env.API_TOKEN;
//console.log(`Validate bearer token middleware ${authToken} ${apiToken}`)

if(!authToken || authToken.split(' ')[1] !== apiToken){
    res.status(401).json({ error: 'Unauthorized request'})
}

next()
})

const handleGetMovie =  (req, res) =>{
    
    const { genre, country, avg_vote } = req.query;
    let results = MOVIEDATA;

    if(genre){
        results = results.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }
    if(country){
        results = results.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))   
    }
    if(avg_vote){
        results = results.filter(movie => movie.avg_vote >= avg_vote)  
    }

  


    res.send(results);
    //res.send(MOVIEDATA)
}

app.get('/movie', handleGetMovie)


app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })

const PORT=process.env.PORT || 8000

app.listen(PORT, () =>{
  //  console.log('Listening on port 8000')
})