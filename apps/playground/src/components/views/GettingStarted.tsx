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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                sapiente facilis quas incidunt minus culpa animi, non nobis
                numquam quibusdam atque nulla eos ducimus distinctio
                exercitationem officiis laboriosam. Eos, eveniet.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                sapiente facilis quas incidunt minus culpa animi, non nobis
                numquam quibusdam atque nulla eos ducimus distinctio
                exercitationem officiis laboriosam. Eos, eveniet.
              </p>
            </div>
            <div className="my-auto">
              <CodeBlock
                title="index.ts"
                code={defaultValues.gettingStarted}
                language={"javascript" as Language}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
