const mongoose = require("mongoose");

const product = mongoose.Schema(
  {
    type: "string",
    details: "string",
    prix: "string",
    code: "string",
  },

  {
    timestamps: true,
  }
);
//on store dans une variable = mongoose.model("collectionName", schema/modèle)
//C'est cette variable qu'on va destructurer dans le serveur pour utiliser le modèle
const postProducts = mongoose.model('shopProducts', product)
//

const allproduct = mongoose.Schema(
  {
    type: "string",
    imageUrl: "string",
    infoProduit: "string",
    auteur: "string",
    prix: "string",
    etat: "string",
    quantity: "string",
    code: "string"
  },

  {
    timestamps: true,
  }
);
//mongoose.model("collectionName", schema)
const postAllProduct = mongoose.model('allProduct', allproduct)

module.exports = {postProducts, postAllProduct };
