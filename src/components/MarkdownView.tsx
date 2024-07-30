"use client";

import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MarkdownView = (props: {
  path: string;
  customPathTransform?: (url: string) => string;
}) => {
  const [content, setContent] = React.useState<string>("");

  React.useEffect(() => {
    let path = props.path;

    if (path.startsWith("data/")) {
      path = "/api/text?fn=" + encodeURIComponent(path);
    }

    fetch(path)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        setContent(text);
      });
  }, []);

  return content !== "" ? (
    <Markdown
      className="prose:max-w-none prose w-full max-w-none"
      urlTransform={(url) => {
        if (url.startsWith("http")) {
          return url;
        }

        if (props.customPathTransform) {
          url = props.customPathTransform(url);
        }

        if (url.startsWith("data/")) {
          const fileType = url.split(".").pop();
          if (fileType === "svg") {
            return "/api/svg?fn=" + encodeURIComponent(url);
          } else if (
            fileType === "png" ||
            fileType === "jpg" ||
            fileType === "jpeg"
          ) {
            return "/api/image?fn=" + encodeURIComponent(url);
          } else {
            return "/api/text?fn=" + encodeURIComponent(url);
          }
        }

        return props.path.split("/").slice(0, -1).join("/") + "/" + url;
      }}
      remarkPlugins={[remarkGfm]}
      remarkRehypeOptions={{
        allowDangerousHtml: true,
      }}
    >
      {content}
    </Markdown>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <i className="bi bi-arrow-clockwise animate-spin text-white"></i>
    </div>
  );
};
