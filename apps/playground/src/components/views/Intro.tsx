import { Container } from "../utils/Container";

export function Intro() {
  return (
    <div className="py-40">
      <Container>
        <div className="flex flex-col align-center justify-center w-full gap-5">
          <p className="flex flex-col font-bold text-center text-4xl">
            <span>Leverage AI to generate</span>
            <span>GraphQL queries from plain text.</span>
          </p>
        </div>
      </Container>
    </div>
  );
}
