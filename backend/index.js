const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com PostgreSQL
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "123456", 
    database: "tiverdedb",
    port: 5432
});

// Rota POST do formulário
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );

        if (result.rows.length > 0) {
            return res.send("<h2>Login realizado com sucesso!</h2>");
        } else {
            return res.send("<h2>Usuário ou senha incorretos.</h2>");
        }

    } catch (error) {
        console.log(error);
        res.send("Erro ao tentar fazer login.");
    }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
