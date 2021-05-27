const express = require('express');

const app = express()
const port = process.env.PORT || 3000;

// Load Environment Vars from .env file
require('dotenv-safe').config();

app.set('view engine', 'js');
app.set('views', './views');
app.engine('js', require('consolidate').underscore);
app.get('/js/env.js', function(req, res) {
  res.render('env', { 
    storeUrl : process.env.STORE_URL,
    checkoutUrl : process.env.CHECKOUT_URL
  });
  // res.send(500);
});
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

// var process = require('process')
process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
})

