import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import expressStaticGzip from "express-static-gzip";
import { GQLPTClient } from "gqlpt";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const config = {
  STATIC_FOLDER: path.join(__filename, "../../../playground/build"),
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
