import { css } from "@emotion/css";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useClipboard } from "use-clipboard-copy";

import { mkText, Pattern, splitPattern } from "~/logic/textgenerator";

type PageProps = {
  icon: string | null;
  pattern: string | null;
  name: string | null;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      icon: query.icon && typeof query.icon === "string" ? query.icon : null,
      pattern: query.pattern && typeof query.pattern === "string" ? query.pattern : null,
      name: query.name && typeof query.name === "string" ? query.name : null,
    },
  };
};

import isUrl from "is-url";

export const Page: NextPage<PageProps> = (page) => {
  const [rawIconURL, setRawIconURL] = useState<string | null>(page.icon);
  const [name, setName] = useState<string | null>(page.name);
  const [rawPattern, setRawPattern] = useState<string | null>(page.pattern);
  const pattern = useMemo(() => rawPattern != null && splitPattern(rawPattern), [rawPattern]);

  const iconUrl = useMemo(() => (rawIconURL && isUrl(rawIconURL)) && rawIconURL, [rawIconURL]);
  const imageUrl = useMemo(() => {
    if (!iconUrl || !name || !pattern) return null;
    const url = new URL(
      "/api/image",
      `${
        process.env.NEXT_PUBLIC_APP_URL?.startsWith("localhost") ? "http" : "https"
      }://${process.env.NEXT_PUBLIC_APP_URL}`,
    );
    url.searchParams.set("icon", iconUrl);
    url.searchParams.set("name", name);
    url.searchParams.set("pattern", pattern.join(""));
    return url.toString();
  }, [iconUrl, name, pattern]);

  const clipboard = useClipboard();
  const pageUrl = useMemo(() => {
    if (!iconUrl || !name || !pattern) return null;
    const url = new URL(
      "/",
      `${
        process.env.NEXT_PUBLIC_APP_URL?.startsWith("localhost") ? "http" : "https"
      }://${process.env.NEXT_PUBLIC_APP_URL}`,
    );
    url.searchParams.set("icon", iconUrl);
    url.searchParams.set("name", name);
    url.searchParams.set("pattern", pattern.join(""));
    return url.toString();
  }, [iconUrl, name, pattern]);
  const handleCopyPageUrl = useCallback(() => {
    if (pageUrl) clipboard.copy(pageUrl);
  }, [clipboard, pageUrl]);

  return (
    <>
      <Head>
        <title>wotaku-reply-generator</title>
        <meta property="og:title" content="wotaku-reply-generator" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${
            process.env.NEXT_PUBLIC_VERCEL_URL?.startsWith("localhost") ? "http" : "https"
          }://${process.env.NEXT_PUBLIC_VERCEL_URL}`}
        />
        <meta name="twitter:title" content="wotaku-reply-generator" />
        <meta name="twitter:creator" content="@SnO2WMaN" />
        {imageUrl && (
          <>
            <meta name="og:image" content={imageUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:description" content={mkText(pattern as Pattern)} />
          </>
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Head>
      <main>
        <h1 className={css({ fontSize: "1.5rem" })}>ヲタク・リプライ・ジェネレータ</h1>
        <div className={css({ marginBlockStart: "8px" })}>
          <h2>パラメータ</h2>
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              rowGap: "8px",
            })}
          >
            <input
              type={"url"}
              value={rawIconURL || ""}
              placeholder={"アイコンURL: https://github.com/ghost.png"}
              onChange={(e) => {
                setRawIconURL(e.target.value);
              }}
            />
            <input
              type={"name"}
              value={name || ""}
              placeholder={"表示名: 単色アイコン"}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type={"text"}
              value={rawPattern || ""}
              placeholder={"パターン: 129346"}
              onChange={(e) => {
                setRawPattern(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={css({ marginBlockStart: "8px" })}>
          <h2>生成される文(例)</h2>
          <p className={css({ wordBreak: "break-all" })}>
            {!pattern && "無効なパターンです"}
            {pattern && mkText(pattern)}
          </p>
        </div>
        {pageUrl && (
          <div className={css({ marginBlockStart: "8px" })}>
            <h2>ツイッター用URL</h2>
            <p className={css({ wordBreak: "break-all" })}>
              <a className={css({ fontSize: "0.75rem" })} href={pageUrl}>
                {pageUrl}
              </a>
              <span className={css({ fontSize: "1.5rem", cursor: "pointer" })} onClick={() => handleCopyPageUrl()}>
                📋
              </span>
            </p>
          </div>
        )}
        {imageUrl && (
          <div className={css({ marginBlockStart: "8px" })}>
            <h2>画像</h2>
            <div
              className={css({
                position: "relative",
                height: "360px",
              })}
            >
              <Image
                src={imageUrl}
                alt="auto-generated wotaku reply image"
                layout="fill"
                objectFit="contain"
                unoptimized
              />
            </div>
          </div>
        )}
        <div className={css({ marginBlockStart: "8px" })}>
          <h2>表</h2>
          <ul>
            <li>1. すいません</li>
            <li>2. しかし</li>
            <li>3. これはどういうことですか？</li>
            <li>4. あなたはオタクなのですか？</li>
            <li>5. そのようなことはありえません</li>
            <li>6. そのような行動はオタク以外しません</li>
            <li>7. [ランダムな猥語]</li>
            <li>8. ハァッハァッハァッ</li>
            <li>9. オタクは経済を回しています</li>
            <li>0. オタクは経済を回していません</li>
          </ul>
          <p>
            <a href="https://twitter.com/CR3P9/status/1552146859833327617">
              出典
            </a>
          </p>
        </div>
      </main>
    </>
  );
};
export default Page;
