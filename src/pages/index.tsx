import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { documentToReactComponents as renderRichText } from "@contentful/rich-text-react-renderer";

import styles from "../styles/Home.module.css";
import { useMicrocopy } from "../common/hooks/useMicrocopy";
import { instance as contentService } from "../common/services/contentful";
import {
  IMicrocopy,
  IMicrocopyRichText,
} from "../common/types/generated/contentful";

interface Props {
  microcopy: ReadonlyArray<IMicrocopy | IMicrocopyRichText>;
}

const Home: NextPage<Props> = (props) => {
  console.log("🚀 ~ file: index.tsx ~ line 19 ~ props", props);
  const copy = useMicrocopy(props.microcopy);

  return (
    <div className={styles.container}>
      <Head>
        <title>{copy.get("title")}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{copy.get("title")}</h1>

        <div className={styles.description}>
          {renderRichText(copy.getDocument("description"))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export const getStaticProps = async ({ locale }: any) => {
  const page = await contentService.fetchPageBySlug<any>("/index", {
    locale,
  });

  return {
    props: {
      microcopy: page.microcopy ?? [],
    },
  };
};

export default Home;
