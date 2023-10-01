import { Container } from "../utils/Container";
import { Logo } from "../utils/Logo";
import { githubPurple, npmPurple } from "../utils/images";

export function Header() {
  return (
    <div className="bg-graphiql-light w-full py-2">
      <Container>
        <nav>
          <div className="flex flex-wrap items-center justify-between mx-auto py-2">
            <a href="/" className="flex items-center">
              <span className="w-10">
                <Logo />
              </span>
              <span className="ml-5 self-center font-bold whitespace-nowrap text-gqlpt-purple text-xs md:text-lg">
                GQLPT
              </span>
            </a>
            <div className="flex gap-10">
              <a
                href="https://www.npmjs.com/package/gqlpt"
                className="flex items-center"
              >
                <span className="w-8">
                  <img src={npmPurple} alt="npm" />
                </span>
              </a>
              <a
                href="https://github.com/rocket-connect/gqlpt"
                className="flex items-center"
              >
                <span className="w-8">
                  <img src={githubPurple} alt="github" />
                </span>
              </a>
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
}
