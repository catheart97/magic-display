"use client";

import React from "react";
import { getTipps, getTSXTipps } from "../server/Server";
import { MarkdownView } from "./MarkdownView";
import { CardStack } from "./CardStack";
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
        "h-full w-[inherit] overflow-hidden rounded-xl bg-white p-4 " +
        props.className
      }
    >
      {props.children}
    </div>
  );
};

export const Tipps = React.memo(() => {
  const [tipps, setTipps] = React.useState<MarkdownElement[]>([]);
  const [components, setTSXComponents] = React.useState<
    React.ReactElement<ITipp>[]
  >([]);

  React.useEffect(() => {
    (async () => {
      // import each tsx file in the folder
      const tipps = await getTipps();
      setTipps(tipps);
      try {
        const tsxTipps = await getTSXTipps();
        const components = await Promise.all(
          tsxTipps.map(async (tsx) => {
            const key = tsx.replace("data/", "./");
            const module = DynamicTipps(key);
            return (
              <Tipp key={tsx} className="flex">
                <module.default />
              </Tipp>
            );
          }),
        );
        setTSXComponents(components);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="h-full w-full shrink grow gap-2 text-neutral-800">
      <CardStack>
        {[
          ...components,
          ...tipps.map((tipp, index) => (
            <Tipp key={index} className="h-full">
              <div className="flex h-full w-full items-stretch">
                <div className="grow">
                  <MarkdownView path={tipp.path} />
                </div>
                <div
                  className="w-fit pl-6 text-center text-3xl uppercase text-neutral-900"
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
