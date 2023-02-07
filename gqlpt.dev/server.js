import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import expressStaticGzip from "express-static-gzip";
import { GQLPTClient } from "gqlpt";

const config = {
  STATIC_FOLDER: process.env.STATIC_FOLDER,
  HTTP_PORT: process.env.HTTP_PORT,
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(expressStaticGzip(config.STATIC_FOLDER, {}));

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
    res.status(500).send(error.message);
  }
});

app.get("*", expressStaticGzip(config.STATIC_FOLDER, {}));
app.use("*", expressStaticGzip(config.STATIC_FOLDER, {}));

function main() {
  app.listen(config.HTTP_PORT, (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`istening at http://localhost:${config.HTTP_PORT}`);
  });
}

main();
