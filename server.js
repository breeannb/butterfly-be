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
  const id = req.body; // posts are in the body for security reasons
  console.log('hello', req.body);
  const data = await client.query(
    `INSERT INTO butterflies (name, wingspan, endangered, color, owner_id)
    VALUES ('monarch', 5, false, 'red', 1) 
    returning *`, 
    [id] //sanitized 
  );

  res.json(data.rows);
});


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
