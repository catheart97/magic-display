"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import * as IDB from "idb-keyval";
import Cookies from "js-cookie";

const PRODUCTION = process.env.NODE_ENV === "production";

export const QueryProvider = (props: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  React.useEffect(() => {
    // look for session cookie / if not create one which expires in 6 hours
    (async () => {
      if (!Cookies.get("idb-session") || !PRODUCTION) {
        Cookies.set("idb-session", Math.random().toString(36).substring(7), {
          expires: 1 / 4,
        });
        // clear all idb keys
        await IDB.clear();
        console.log("IDB Cleared");
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};
