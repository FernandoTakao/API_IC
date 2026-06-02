require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/db");

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`App running on port ${port}`);
        });
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
}

startServer();