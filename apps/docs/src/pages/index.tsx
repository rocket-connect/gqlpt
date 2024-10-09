import BrowserOnly from "@docusaurus/BrowserOnly";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";

import { Playground } from "../components/views/Playground";
import { Supported } from "../components/views/Supported";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title mb-0">
          {siteConfig.title}
        </Heading>
        <p className="m-0">
          {"("}GraphQL Plain Text{")"}
        </p>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={`${styles.buttons}`}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <BrowserOnly>
      {() => (
        <Layout
          title={`Home`}
          description="Leverage AI to generate GraphQL queries from plain text"
        >
          <HomepageHeader />
          <main>
            <section className={styles.features}>
              <Playground />
              <Supported />
            </section>
          </main>
        </Layout>
      )}
    </BrowserOnly>
  );
}
