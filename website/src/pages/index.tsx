import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";

import TodoApp from "../components/TodoApp";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero px-0! sm:px-4!", styles.heroBanner)}>
      {/* <div className={styles.heroBannerBackground}></div> */}
      <div className="container z-10">
        <h1 className={clsx("hero__title", "mb-4 font-bold text-6xl")}>
          {siteConfig.title}
        </h1>
        <p className="hero__subtitle mb-4 font-medium">{siteConfig.tagline}</p>
        <div className="mb-10">
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Get Started
          </Link>
        </div>
        <TodoApp />
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
    </Layout>
  );
}
