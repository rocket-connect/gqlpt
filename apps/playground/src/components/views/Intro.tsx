import { Container } from "../utils/Container";

export function Intro() {
  return (
    <div className="py-40">
      <Container>
        <div className="flex flex-col md:flex-row  align-center justify-center  w-full">
          <p className="flex flex-col font-bold text-center text-4xl">
            <span>Leverage ChatGPT to generate</span>
            <span>GraphQL queries from plain text.</span>
          </p>
        </div>
      </Container>
    </div>
  );
}
