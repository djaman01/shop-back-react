const mongoose = require("mongoose");

const product = mongoose.Schema(
  {
    type: "string",
    details: "string",
    prix: "string",
    code: "string"
  },

  {
    timestamps: true,
  }
);
//on store dans une variable = mongoose.model("collectionName", schema/modèle)
//C'est cette variable qu'on va destructurer dans le serveur pour utiliser le modèle
const postProducts = mongoose.model('shopProducts', product)

module.exports = {postProducts};
