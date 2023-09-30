import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import expressStaticGzip from "express-static-gzip";
import { GQLPTClient } from "gqlpt";
import path from "path";

dotenv.config({ path: "./.env" });

const config = {
  STATIC_FOLDER: path.join(__dirname, "../../playground/build"),
  HTTP_PORT: 5000,
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(expressStaticGzip(config.STATIC_FOLDER, {}));
app.use(express.static("public"));

app.post("/generate", async (req, res) => {
  try {
    const { query, apiKey, typeDefs } = req.body;
    const client = new GQLPTClient({
      apiKey,
      typeDefs,
    });

    const result = await client.generate(query);

    res.json(result);
  } catch (error) {
    const e = error as Error;
    res.status(500).send(e.message);
  }
});

app.get("*", expressStaticGzip(config.STATIC_FOLDER, {}));
app.use("*", expressStaticGzip(config.STATIC_FOLDER, {}));

async function main() {
  await app.listen(config.HTTP_PORT);

  console.log(`Listening at http://localhost:${config.HTTP_PORT}`);
}

main();
