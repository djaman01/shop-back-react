const mongoose = require("mongoose");


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

module.exports = {postAllProduct };
