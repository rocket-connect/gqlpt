import { Container } from "../utils/Container";
import { logo } from "../utils/images";

export function About() {
  return (
    <div className="bg-graphiql-light text-graphiql-dark">
      <Container>
        <div className="flex flex-col xl:flex-row justify-start py-20 gap-20 w-full xl:w-5/6 lg:mx-auto">
          <div className="my-auto w-full mx-auto">
            <img className="md:mx-auto md:my-0 w-40" src={logo} alt="logo" />
          </div>

          <div className="flex flex-col gap-10">
            <h2 className="text-4xl font-bold">About</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
              delectus nobis excepturi sequi corrupti. Saepe suscipit non ullam
              quam nulla tenetur, aliquam quibusdam repudiandae iste nisi minima
              excepturi commodi dicta.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
              delectus nobis excepturi sequi corrupti. Saepe suscipit non ullam
              quam nulla tenetur, aliquam quibusdam repudiandae iste nisi minima
              excepturi commodi dicta.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
