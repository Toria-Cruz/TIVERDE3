// ----------------------------------------------------
// ROTAS DE LOGIN E CADASTRO DE USUÁRIO
// ----------------------------------------------------
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    host: "postgres",      // NOME DO SERVIÇO DO DOCKER
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "tiverdedb"  // NOME DO BANCO DO DOCKER
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const exists = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (exists.rows.length > 0) {
            return res.status(400).send("Usuário já existe!");
        }

        await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [username, password]
        );

        return res.redirect("http://localhost:8080/login.html");

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao cadastrar usuário.");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );

        if (result.rows.length > 0) {
            return res.send("Login realizado com sucesso!");
        }

        return res.status(401).send("Usuário ou senha incorretos.");

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao fazer login.");
    }
});



app.listen(5000, () => console.log("Servidor rodando em http://localhost:5000"));

