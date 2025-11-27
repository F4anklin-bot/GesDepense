const express = require("express");
const router = express.Router();
const bd = require('./bd');
const bcrypt = require("bcrypt");
const session = require("express-session");

//REGISTER
router.post('/register', async (req, res) => {
    const { username, secret } = req.body;

    if (!username || !secret) {
        return res.status(400).json({
            message: "Erreur, champs manquants"
        });
    }

    if (secret.length < 4) {
        return res.status(400).json({
            message: "Erreur, le mot de passe est trop court"
        });
    }

    try {

        // Vérifier si l'utilisateur existe
        const verify = "SELECT * FROM users WHERE username=?";
        bd.query(verify, [username], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Erreur BD" });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Cet utilisateur existe déjà"
                });
            }

            // Si on arrive ici, l'utilisateur n'existe pas → on peut créer

            const hashedsecret = await bcrypt.hash(secret, 12);

            const sql = "INSERT INTO users(username, secret) VALUES (?,?)";
            bd.query(sql, [username, hashedsecret], (err2, result2) => {
                if (err2) {
                    return res.status(500).json({
                        message: "Erreur BD lors de l'insertion"
                    });
                }

                return res.status(201).json({
                    message: "Utilisateur créé avec succès"
                });
            });
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur serveur"
        });
    }
});


//LOGIN
router.post('/login', (req, res) => {
    const {username, secret} = req.body;


    const sql = "SELECT * FROM users WHERE username=?";

    bd.query(sql, [username, secret], (err, result) => {
        if (err){
            return res.json(500).json({
                message : "Erreur bd"
            })
        }

        if (result.length === 0){
            res.status(404).json({
                message : "Identifiants invalides"
            })
        } else {
            const user = result[0];

            const equal = bcrypt.compare(user.secret, secret);

            if (!equal){
                res.status(400).json({
                    message : "Identifiants invalides"
                })
            } 

            //CREATION DE SESSION
            req.session.user({
                id : user.userid,
                username : user.username
            })

            res.status(200).json({
                message : "Vous êtes connectés",
                user : req.session.user
            })
        }
    })
})






module.exports = router;
