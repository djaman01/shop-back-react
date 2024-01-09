//Code pour transformer mon PC en server avec Express

const express = require('express');
const app = express();
app.use(express.json());//To convert=parse incoming JSON data from HTTP requests, to Json Objects easier to read for the server

const port = 3005 //app.listen(port, ...) sets up the server to listen on that port. / On trouver le contenu du site ici: http://localhost:3005/

const db = require('./connect-db')

require('dotenv').config(); //To use the environment variable

const cors = require('cors')
app.use(cors({
  origin: ["http://localhost:3000"],//Local Host: to access the front-end side through this URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

//Destructure les variables qui contiennent les modèles et collection name
const { postProducts } = require('./model-doc')//on destructure les differents models

app.post('/upload', async (req, res) => {
  const { type, details, prix, code } = req.body; //on tire la value du body de la requête en destructurant pour assigner les values aux properties
  try {
    const newPost = await postProducts.create({ type, details, prix, code }); //To create a new document (record) in the MongoDB collection in a Synchronous manner; so that if there is an arror, it'll be catch after
    res.json(newPost)//permet de renvoyer la structure dans la console si le document est crée
  }
  catch (error) {//Prevents the error from crashing the entire application and communicate errors to the client.
    res.status(500).send(error)
  }
});

//database connection: http://localhost:3005/ pour voir le message
app.get('/', (req, res) => {
  res.send('Hello, this is your Express server!');
});


//Starting the Server:
//This code starts the Express server and listens on the specified port (3005 in this case). 
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})


