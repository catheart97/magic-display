"use-client";

import React from "react";
import * as IDB from "idb-keyval";

export const PersistentImage = (
  props: React.HTMLAttributes<HTMLImageElement> & {
    src: string;
    alt?: string;
  },
) => {
  const [imgUrl, setImgUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      const img = (await IDB.get("img#" + props.src)) as Blob;
      if (img != undefined) {
        // create data url from blob
        setImgUrl(URL.createObjectURL(img));
      } else {
        // fetch image
        const response = await fetch(props.src);
        const blob = await response.blob();
        await IDB.set("img#" + props.src, blob);
        setImgUrl(URL.createObjectURL(blob));
      }
    })();
  }, []);

  if (imgUrl != null && imgUrl !== "" && props.src !== "") {
    if (error) {
      return (
        <div
          className={
            "flex h-full w-full flex-col items-center justify-center gap-2 border-0 p-16 text-4xl outline-hidden " +
            props.className
          }
        >
          <div className="text-6xl font-bold">
            <a className="font-emoji">🤷🏼‍♀️</a> <i>Ooops!</i>
          </div>
          {props.alt}
        </div>
      );
    } else {
      return (
        <img
          {...props}
          src={props.src}
          className={
            "flex items-center justify-center border-0 text-4xl outline-hidden " +
            props.className
          }
          onError={() => setError(true)}
        />
      );
    }
  } else {
    return (
      <div className="aspect-1 m-0 flex h-full w-full items-center justify-center bg-black/60 object-cover text-7xl text-neutral-400">
        <i className="bi bi-hourglass animate-spin" />
      </div>
    );
  }
};
