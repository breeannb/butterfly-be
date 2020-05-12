require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

// get route for all butterflies 
app.get('/butterflies', async(req, res) => {
  const data = await client.query('SELECT * from butterflies');

  res.json(data.rows);
});

//get api route for one butterfly by particular id
app.get('/butterflies/:id', async(req, res) => {
  const id = req.params.id; // when using the :id we use params instead of search 
  const data = await client.query(
    'SELECT * from butterflies WHERE id = $1', 
    [id] //sanitized 
  );

  res.json(data.rows);
});

//create a butterfly
app.post('/butterflies/', async(req, res) => {
  // console.log('hello', req.body); successfully logged out a new post butterfly object
  const data = await client.query(
    `INSERT INTO butterflies (name, wingspan, endangered, color, owner_id)
    VALUES ($1, $2, $3, $4, $5) 
    returning *`, 
    [req.body.name, req.body.wingspan, req.body.endangered, req.body.color, req.body.owner_id] //sanitized 
  );

  res.json(data.rows);
});


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
