import "~/styles/main.css";

import { AppProps } from "next/app";
import React from "react";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Component {...pageProps} />
  );
};

export default MyApp;
