import { Container } from "../utils/Container";
import {
  graphqlicon,
  miticon,
  openaiicon,
  typescripticon,
} from "../utils/images";

const supported = [
  {
    name: "OpenAI",
    content: "Using the official OpenAI API.",
    img: openaiicon,
    link: "https://opentelemetry.io/",
  },
  {
    name: "Typescript",
    content: "Written in Typescript and published to NPM.",
    img: typescripticon,
    link: "https://www.typescriptlang.org/",
  },
  {
    name: "MIT",
    content: "Open Source and hosted on Github.",
    img: miticon,
    link: "https://github.com/rocket-connect/gqlpt",
  },
  {
    name: "GraphQL",
    content: "Fits into your existing workflow.",
    img: graphqlicon,
    link: "https://graphql.org/",
  },
];

export function Supported() {
  return (
    <div className="bg-graphiql-light text-graphiql-medium pt-5 pb-10">
      <Container>
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {supported.map((item) => (
            <div className="flex flex-col justify-center align-center text-center gap-5">
              <div className="w-12 mx-auto">
                <a href={item.link}>
                  <img src={item.img} alt={item.name} />
                </a>
              </div>
              <p className="w-3/5 mx-auto text-sm italic">{item.content}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
