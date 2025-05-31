"use client";

import React from "react";
import { Reference, IReference } from "@/components/reference";
import { MarkdownView } from "@/components/markdown-view";
import { getReferenceEntries } from "@/server/server";
import { Searchbar } from "@/components/searchbar";

export const ReferenceList = () => {
  const [renderEntries, setRenderEntries] = React.useState<
    Array<React.ReactElement<IReference>>
  >([]);
  const [filter, setFilter] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const mappedEntries = await getReferenceEntries();

      const render = [];
      for (const entry of mappedEntries) {
        render.push(
          <Reference title={entry.title} key={entry.title}>
            <MarkdownView
              path={entry.path}
              customPathTransform={(url) => {
                return "data/reference/" + url;
              }}
            />
          </Reference>,
        );
      }

      setRenderEntries(render);
    })();
  }, []);

  return (
    <div className="relative flex h-full max-h-full w-full flex-col gap-2 overflow-y-scroll p-2">
      <Searchbar filter={filter} setFilter={setFilter} />
      {renderEntries
        .filter((child) => {
          return child.props.title.toLowerCase().includes(filter.toLowerCase());
        })
        .sort((a, b) => {
          return a.props.title.localeCompare(b.props.title);
        })
        .map((child, index) => {
          return child;
        })}
    </div>
  );
};
