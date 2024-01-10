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
const { postProducts, postAllProduct } = require('./model-doc')//on destructure les differents models

const multer  = require('multer')
const path = require('path')

//------------------------------------------------------------
//Pour post les produits stockés dans un fichier json

app.post('/upload', async (req, res) => {
  const { type, details, prix, code, imageUrl } = req.body; //on tire la value du body de la requête en destructurant pour assigner les values aux properties
  try {
    const newPost = await postProducts.create({ type, details, prix, code, imageUrl }); //To create a new document (record) in the MongoDB collection in a Synchronous manner; so that if there is an arror, it'll be catch after
    res.json(newPost)//permet de renvoyer la structure dans la console si le document est crée
  }
  catch (error) {//Prevents the error from crashing the entire application and communicate errors to the client.
    res.status(500).send(error)
  }
});

//--------------------------------------------------------------

//Pour stocker les fichier images send par le front-end, dans le serveur
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }); //Pour gérer les fichier téléchargés dans les routes express

//Pour appliquer le stockage de l'image dans le serveur (Middleware) + envoyer l'url de l'image dans la Database
app.post('/realup', upload.single('file'), async (req, res) => {

  try {

    const imageUrl = req.file.path.replace(/\\/g, '/'); //On store le path de l'image dans la variable imageUrl

    const { type, auteur, infoProduit, prix } = req.body; // Extract product data by destructuring the object from the request body

    const newProduct = new postAllProduct({type,auteur,imageUrl,infoProduit, prix});

    // Save the product to the database
    await newProduct.save();
    // Respond with a success message or the newly created product
    // res.json({ message: 'Image uploaded and product data stored successfully', product: newProduct });
    res.json({ imageUrl })
  }
   catch (error) {
    console.error('Error handling image upload and product data storage:', error);
    res.status(500).json({ error: error.message });
  }
});


//----------------------------------------------------------------
//database connection: http://localhost:3005/ pour voir le message
app.get('/', (req, res) => {
  res.send('Hello, this is your Express server!');
});

//----------------------------------------------------------------------------

//Starting the Server:
//This code starts the Express server and listens on the specified port (3005 in this case). 
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})


