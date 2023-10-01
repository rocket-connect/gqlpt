import { About } from "../views/About";
import { Footer } from "../views/Footer";
import { GettingStarted } from "../views/GettingStarted";
import { Intro } from "../views/Intro";
import { Playground } from "../views/Playground";
import { Supported } from "../views/Supported";

export function Home() {
  return (
    <div>
      <Intro />
      <div className="hidden lg:block">
        <Playground />
      </div>
      <About />
      <Supported />
      <GettingStarted />
      <Footer />
    </div>
  );
}
