//Code pour transformer mon PC en server avec Express

const express = require('express');
const app = express();
app.use(express.json());//To convert=parse incoming JSON data from HTTP requests, to Json Objects easier to read for the server

const port = 3005 //app.listen(port, ...) sets up the server to listen on that port. / On trouver le contenu du serveur ici: http://localhost:3005/

const db = require('./connect-db')

require('dotenv').config(); //To use the environment variable

const cors = require('cors')
app.use(cors({
  origin: ["http://localhost:3000"],//Local Host: to access the front-end side through this URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

//Destructure les variables qui contiennent les modèles et collection name
const { postAllProduct } = require('./model-doc')//on destructure les differents models

const multer = require('multer')
const path = require('path')

//To Post the products to the database---------------------------------

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

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

const upload = multer({ storage: storage }); //Pour gérer les fichier téléchargés dans les routes express

//Pour appliquer le stockage de l'image dans le serveur (Middleware) + envoyer l'url de l'image dans la Database
app.post('/realup', upload.single('file'), async (req, res) => {

  try {

    const imageUrl = req.file.path.replace(/\\/g, '/'); //On store le path de l'image dans la variable imageUrl

    const { type, auteur, infoProduit, quantity, prix } = req.body; // Extract product data by destructuring the object from the request body

    const newProduct = await postAllProduct.create({ type, auteur, imageUrl, infoProduit, quantity, prix })
    res.json(newProduct) //Pas obligé, mais important car envoie dans la console le produit ajouté en json = confirmation ajout sans accéder à la database
  }
  catch (error) {
    console.error('Error handling image upload and product data storage:', error);
    res.status(500).json({ error: error.message });
  }
});

//To GET the last 20 products on the HomePage-----------

app.get('/homeProducts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20; // Get the 'limit' query parameter from the request or default to 20
    const postProducts = await postAllProduct.find().sort({ _id: -1 }).limit(limit); // Sort by _id in descending order to get the last 20 products
    res.json(postProducts) // !!! res.json() OBLIGé Pour envoyer la data au front-end
  }
  catch (error) {
    console.error('Error fetching products from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//GET data of products in the Dashboard-----------------
app.get('/allProducts', async (req, res) => {

  try {
    const products = await postAllProduct.find(); //.find()= trouve tous les produits
    res.json(products);// !!! Obligé pour envoyé les produits en réponse
  }
  catch (error) {
    console.error('Error fetching products from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//PUT to change products properties------------------------------
app.put('/putDash/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProductData = req.body;
    // productId= trouve le produit / updatedProductData= applique les changement reçu du front-end/{new:true} = Returns the modified document after the update.
    const updatedProduct = await postAllProduct.findByIdAndUpdate(productId, updatedProductData, { new: true }); //!!! : à la fin OBLIGE
      //To show update on the browser or handle errors if product isn't found
      (updatedProduct) ? res.json(updatedProduct) : res.status(404).json({ error: 'product not found' }); //dans l'objet, je donne à l'objet error la value 'product not found'
  }
  //To handle server error = back-end code error
  catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
}
)

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


