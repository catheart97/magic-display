"use client";

import React from "react";
import { getTipps, getTSXTipps } from "../server/server";
import { MarkdownView } from "./markdown-view";
import { CardStack } from "./card-stack";
import { MarkdownElement } from "@/types/MarkdownElement";

const DynamicTipps = require.context("../../data", true, /\.tsx$/);

interface ITipp {
  children: React.ReactNode;
  className?: string;
}

export const Tipp = (props: ITipp) => {
  return (
    <div
      className={
        "h-full w-[inherit] overflow-hidden rounded-3xl border-french-900 bg-white/80 backdrop-blur inset-shadow-glass p-4 " +
        props.className
      }
    >
      {props.children}
    </div>
  );
};

export const Tipps = React.memo(() => {
  const [tipps, setTipps] = React.useState<MarkdownElement[]>([]);

  React.useEffect(() => {
    (async () => {
      // import each tsx file in the folder
      const tipps = await getTipps();
      setTipps(tipps);
    })();
  }, []);

  return (
    <div className="h-full w-full shrink grow gap-2 text-neutral-800">
      <CardStack speed={40000}>
        {[
          ...tipps.map((tipp, index) => (
            <Tipp key={index} className="h-full">
              <div className="flex h-full w-full items-stretch">
                <div className="h-full grow">
                  <MarkdownView path={tipp.path} />
                </div>
                <div
                  className="w-fit shrink-0 pl-6 text-center text-3xl uppercase text-neutral-900"
                  style={{
                    // vertical text
                    // @ts-ignore
                    writingMode: "vertical-rl",
                  }}
                >
                  {tipp.title}
                </div>
              </div>
            </Tipp>
          )),
        ]}
      </CardStack>
    </div>
  );
});

export default Tipps;
