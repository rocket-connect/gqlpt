import { Language } from "prism-react-renderer";

import * as defaultValues from "../../defaults";
import { CodeBlock } from "../utils/CodeBlock";
import { Container } from "../utils/Container";

export function GettingStarted() {
  return (
    <div className="bg-graphiql-medium text-graphiql-light">
      <Container>
        <div className="py-20 lg:w-5/6 lg:mx-auto gap-10">
          <div className="flex flex-col xl:flex-row gap-10">
            <div className="flex flex-col gap-10 my-auto">
              <h2 className="text-4xl font-bold">Getting Started</h2>
              <p>
                To begin using GQLPT, you'll first need to install the relevant{" "}
                <a
                  className="underline"
                  href="https://www.npmjs.com/package/gqlpt"
                >
                  npm package
                </a>
                . Once installed, ensure you import the GQLPT client and the
                OpenAI adapter into your project.
              </p>
              <p>
                Before constructing your GQLPT client, you'll need to obtain an
                API key from OpenAI. You can register and get your key at{" "}
                <a className="underline" href="https://openai.com/">
                  OpenAI's official website
                </a>
                . With the API key at hand and your type definitions (typeDefs),
                you can then instantiate a new GQLPT client instance with the
                OpenAI adapter.
              </p>
              <p>
                Once everything is set up, utilize the 'generate' method on your
                GQLPT client instance. To do this, provide the text you wish to
                generate a GraphQL query from.
              </p>
            </div>
            <div className="bg-graphiql-dark rounded-xl w-5/6 mx-auto">
              <CodeBlock
                title="index.ts"
                code={defaultValues.gettingStarted}
                language={"typescript" as Language}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
