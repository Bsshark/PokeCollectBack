const express = require("express");
const { dbConnection } = require("./DB/config");
const cors = require("cors");
require("dotenv").config();

//Crear app de express
const app = express();

// DB
dbConnection();

//CORS
app.use(cors());

//Directorio Public
app.use(express.static("public"));

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/pokemon", require("./routes/pokemon"));
app.use("/api/collection", require("./routes/collection"));

app.get('*', (req, res) => {
	res.sendFile('index.html', {root: 'public'});
  });

//Escuchar peticiones
app.listen(process.env.PORT || 3000, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

/*
  pwd mongo 7KoVWoUOuy4DDLcG
*/
