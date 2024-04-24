import express from "express";
import path from "path";
import ping from "ping";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();

// Configuração do middleware para analisar o corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, "dist")));

// Rota para pingar um endereço
app.post("/ping", async function (req, res) {
    const { address } = req.body;

    if (!address) {
        return res.status(400).send("Endereço não especificado");
    }
    try {
        const result = await ping.promise.probe(address);
        res.json(result.alive);
    } catch (error) {
        console.error("Erro ao pingar o endereço:", error);
        res.status(500).send("Erro ao pingar o endereço");
    }
});

// Rota para servir o arquivo index.html
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Escuta na porta 3000
app.listen(3000, () => {
    console.log("Servidor está rodando na porta 3000.");
});
