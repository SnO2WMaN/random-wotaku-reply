import chromium from "chrome-aws-lambda";
import escape from "escape-html";
import isUrl from "is-url";
import { NextApiHandler } from "next";

import { mkText, Pattern, splitPattern } from "~/logic/textgenerator";

export const getHtml = ({ icon, pattern, name }: { icon: string; name: string; pattern: Pattern }) => `
  <html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?display=swap&family=M+PLUS+1p">
    <style>
      :root {
        font-family: 'M Plus 1p';
        font-size: 16px;
      }

      * {
        all: unset;
        display: revert;
      }

      style {
        display: none;
      }

      body {
        background: var(--background-color);
        position: relative;

        width: 640px;
        height: 480px;
        box-sizing: border-box;

        padding: 32px 48px;
        background: black;
        color: white;
      }

      #header {
        display: flex;
        align-items: center;
      }

      #icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }

      #name {
        margin-left: 16px;
        font-size: 1.5rem;
      }

      #tweet {
        margin-top: 16px;
      }

      #tweet>p {
        margin-top: 0;
        margin-bottom: 0;
        font-size: 2rem;
        word-break: break-all;
      }
    </style>
  </head>

  <body>
    <div id="header">
      <img id="icon" src="${icon}" />
      <div id="name">
        <span>${name}</span>
      </div>
    </div>
    <div id="tweet">
      <p>${mkText(pattern)}</p>
    </div>
  </body>

  </html>
`;
const handler: NextApiHandler = async (req, res) => {
  const { query: { icon: rawIcon, pattern: rawPattern, name: rawName } } = req;
  if (!rawIcon || Array.isArray(rawIcon) || !isUrl(rawIcon)) {
    res.status(400).end();
    return;
  }
  if (!rawName || Array.isArray(rawName)) {
    res.status(400).end();
    return;
  }

  if (!rawPattern || Array.isArray(rawPattern)) {
    res.status(400).end();
    return;
  }
  const pattern = splitPattern(rawPattern);
  if (!pattern) {
    res.status(400).end();
    return;
  }

  try {
    const browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      headless: true,
      defaultViewport: { ...chromium.defaultViewport, width: 640, height: 480 },
    });
    const page = await browser.newPage();
    await page.setContent(getHtml({ icon: escape(rawIcon), name: escape(rawName), pattern }), {
      waitUntil: "networkidle0",
    });
    const image = await page.screenshot({ type: "png" });

    res.status(200);
    res.setHeader("Content-Type", `image/png`);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(image);
    return;
  } catch (error) {
    if (
      // eslint-disable-next-line no-process-env
      process.env.NODE_ENV !== "production"
    ) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    res.status(500);
    res.end();
    return;
  }
};

export default handler;
