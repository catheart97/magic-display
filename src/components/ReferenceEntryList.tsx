"use client";

import React from "react";
import { ReferenceEntry, IReferenceEntry } from "@/components/ReferenceEntry";
import { MarkdownView } from "@/components/MarkdownView";
import { getReferenceEntries } from "@/server/Server";
import { Searchbar } from "@/components/Searchbar";

export const ReferenceEntryList = () => {
  const [renderEntries, setRenderEntries] = React.useState<
    Array<React.ReactElement<IReferenceEntry>>
  >([]);
  const [filter, setFilter] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const mappedEntries = await getReferenceEntries();

      const render = [];
      for (const entry of mappedEntries) {
        render.push(
          <ReferenceEntry title={entry.title} key={entry.title}>
            <MarkdownView
              path={entry.path}
              customPathTransform={(url) => {
                return "data/reference/" + url;
              }}
            />
          </ReferenceEntry>,
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
