import { Home } from "./components/pages/Home";
import { Header } from "./components/views/Header";

export function App() {
  return (
    <div className="bg-graphiql-dark text-graphiql-light ">
      <Header />
      <Home />
    </div>
  );
}
