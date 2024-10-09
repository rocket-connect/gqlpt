import GraphQLIcon from "@site/static/img/graphql-icon.svg";
import OpenAIIcon from "@site/static/img/openai-icon.svg";
import TypeScriptIcon from "@site/static/img/typescript-icon.svg";
import AnthropicIcon from "@site/static/img/anthropic-icon.svg";

import { Container } from "../utils/Container";

function OpenAI() {
  return <OpenAIIcon />;
}

function GraphQL() {
  return <GraphQLIcon />;
}

function TypeScript() {
  return <TypeScriptIcon />;
}

function Anthropic() {
  return < AnthropicIcon />;
}

const supported = [
  {
    name: "OpenAI",
    content: "Adapters for OpenAI API.",
    Component: OpenAI,
    link: "https://openai.com/",
  },
  {
    name: "anthropic",
    content: "Adapters for Anthropic API.",
    Component: Anthropic,
    link: "https://www.anthropic.com/api",
  },
  {
    name: "Typescript",
    content: "Written in Typescript.",
    Component: TypeScript,
    link: "https://www.typescriptlang.org/",
  },
  {
    name: "GraphQL",
    content: "GraphQL compatible.",
    Component: GraphQL,
    link: "https://graphql.org/",
  },
];

export function Supported() {
  return (
    <div className="bg-graphiql-light text-graphiql-medium py-5 pt-10">
      <Container>
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {supported.map((item) => (
            <div className="flex flex-col justify-center align-center text-center gap-5">
              <div className="w-12 mx-auto">
                <a href={item.link}>
                  <item.Component />
                </a>
              </div>
              <p className="mx-auto font-bold text-sm italic">{item.content}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
