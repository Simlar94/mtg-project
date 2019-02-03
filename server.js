//Global variables.
const express = require("express");
const mongoose = require("mongoose");
const port = 3000;
const app = express();

//Module for declaring which request-formats the server is going to accept. 
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Mongoose database-connector (URL).
mongoose.connect("mongodb://admin:password123@ds141674.mlab.com:41674/magicdb");
//Mongoose Schema-variable.
var Schema = mongoose.Schema;

//Database Schema-structure.
var CardSchema = new Schema({
    //Name of the card.
    card_name: {
        type: String
    },
    //Color of the card. (black, blue, green, red, white).
    card_color: {
        type: String
    },
    //Mana-cost of the card.
    card_manacost: {
        type: Number
    },
    //Card-artwork.
    card_img: {
        type: String
    },
    //Card-type. (land, creature, enchantment, artifact, planeswalker, sorcery, instant)
    //with attributes corresponding to it's type.
    card_type: {
        //Creatures.
        creature: {
            creature_type: {
                type: String
            },
            stats: {
                power: {
                    type: String
                },
                toughness: {
                    type: String
                }
            }
        },
        //Enchantments.
        enchantment: {
            enchantment_type: {
                type: String
            }
        },
        //Artifacts.
        artifact: {
            artifact_type: {
                type: String
            }
        },
        //Planeswalkers.
        planeswalker: {
            planeswalker_type: {
                type: String
            }
        },
        //Sorceries.
        sorcery: {
            sorcery_type: {
                type: String
            }
        },
        //Instants.
        instant: {
            instant_type: {
                type: String
            }
        }
    },
    //Flavour text.
    flavour_text: {
        type: String
    }
});

//Database model-variable. (Collection-name, Schema-structure).
var Card = mongoose.model("Card", CardSchema);

//Get-route for /cards.
app.get("/cards", function (req, res) {
    Card.find({}).then(function (cardData) {
        res.json(cardData);
    });
});

//Post-route for /cards.
app.post("/cards", function (req, res) {
    var cardInfo = new Card(req.body);
    cardInfo.save(function (err, cardData) {
        res.send("Posted successfully.");
    });
});

//Delete-route for /cards/delete. Looks for the value of the"id"-key in the body.
//Then it deletes the object with the corresponding id from the database-collection with the mongoose-function "findOneAndRemove". 
app.delete("/cards/delete", function (req, res) {
    var objectId = req.body.id;

    Card.findOneAndRemove({
        _id: objectId
    }, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Object with id:" + objectId + " deleted.");
        }
    });
});

//Put route for /cards/update.
app.put("/cards/update", function (req, res) {
    var objectId = req.body.id;
    var cardName = req.body.card_name;
    //var cardColor = req.body.card_color;
    //var cardManacost = req.body.card_manacost;
    var cardImg = req.body.card_img;
    //var cardCreatureType = req.body.creature.creature_type;
    //var cardCreaturePower = req.body.creature.stats.power;
    //var cardCreatureTougness = req.body.creature.stats.toughness;
    //var flavourText = req.body.flavour_text;
    
    console.log(cardImg);
    
    Card.findOneAndUpdate({
        _id: objectId
    }, {
        card_name: cardName,
        //card_color: cardColor,
        //card_manacost: cardManacost,
        card_img: cardImg,
        //flavour_text: flavourText
        
    }, function(err){
        if (err){
            res.send(err);
        } else {
            res.send("Object with id:" + objectId + " updated.");
        }
    });
      
});

//Declares which port the server is going to use.
app.listen(process.env.PORT || port, () => console.log("Server is running on port: " + port + "."));