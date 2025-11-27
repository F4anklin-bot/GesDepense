const express = require("express");
const app = express();
const session = require("express-session");
const bd = require("./bd");
const MySQLStore = require("express-mysql-store")(session);


const port = process.env.port || 3000;


app.use(express.json());


const sessionStore = new MySQLStore({}, bd);

app.use(
    session({
        secret : 'secretDeFranklin',
        resave : false,
        saveUninitialized : false,
        store : sessionStore,
        cookie : {
            maxAge : 1000 * 60 * 60 * 24,
            hhtpOnly : true
        }
    })
)



//Appeler les routes de l'authentification
const authRoutes = require('./auth');
app.use('/auth', authRoutes)









app.listen(port, () => {
    console.log(`L'application est en train de tourner sur le port ${port}`)
})