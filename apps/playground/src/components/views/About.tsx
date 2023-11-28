import { Container } from "../utils/Container";
import { logo } from "../utils/images";

export function About() {
  return (
    <div className="bg-graphiql-light text-graphiql-dark">
      <Container>
        <div className="flex flex-col xl:flex-row justify-center py-20 gap-10 w-full md:w-4/6 mx-auto">
          <div className="my-auto mx-auto">
            <img className="md:mx-auto md:my-0 w-40" src={logo} alt="logo" />
          </div>

          <div className="flex flex-col gap-10">
            <h2 className="text-4xl font-bold">About</h2>
            <p>
              GQLPT is an{" "}
              <a className="underline" href="https://openai.com/">
                OpenAI
              </a>
              -powered{" "}
              <a
                className="underline"
                href="https://www.npmjs.com/package/gqlpt"
              >
                npm package
              </a>{" "}
              that translates plain text into a GraphQL query.
            </p>
            <p>
              This package is open source and free to use. You can access its
              source code on{" "}
              <a
                className="underline"
                href="https://github.com/rocket-connect/gqlpt"
              >
                GitHub
              </a>
              .
            </p>
            <p>
              Development and maintenance of GQLPT is handled by{" "}
              <a className="underline" href="https://rocketconnect.co.uk/">
                Rocket Connect
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
