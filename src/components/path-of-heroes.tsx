import { useCampaignMeta, useServerState } from "@/server/client-utility";
import React from "react";

export const PathOfHeros = () => {
  const { campaignMeta, isLoading: campaignMetaLoading } = useCampaignMeta();
  const { serverState, isLoading: serverStateLoading } = useServerState();
  const baseRef = React.useRef<HTMLDivElement>(null);
  const [transform, setTransform] = React.useState({
    x: 0,
    y: 0,
    length: 0,
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (!baseRef.current) return;
    if (campaignMetaLoading || serverStateLoading) return;

    (async () => {
      const vpWidth = baseRef.current!.clientWidth;
      const vpHeight = baseRef.current!.clientHeight;

      const heroPathPath =
        "data/campaigns/" +
        serverState!.campaign +
        "/" +
        campaignMeta!.map!.heroPath;

      const res = await fetch(
        "/api/text?fn=" + encodeURIComponent(heroPathPath),
      );
      const data = await res.text();
      // parse svg into tree
      const svg = new window.DOMParser().parseFromString(data, "image/svg+xml");
      // find element with vectornator:layerName="HeroPath"
      const layer = svg.querySelector("g#Ebene-3");
      const path = layer
        ?.querySelector("g")
        ?.querySelector("path")! as SVGPathElement;
      const pathLength = path.getTotalLength();

      const WIDTH = +svg.documentElement.getAttribute("viewBox")!.split(" ")[2];
      const HEIGHT = +svg.documentElement
        .getAttribute("viewBox")!
        .split(" ")[3];

      console.log(vpWidth, vpHeight, WIDTH, HEIGHT);

      let length = pathLength;
      let alpha = 0;
      const update = () => {
        const pos = path.getPointAtLength(length);
        const length_increment = 0.5;
        length -= length_increment;
        if (length < 0) {
          const posStart = path.getPointAtLength(0);
          const posEnd = path.getPointAtLength(pathLength);

          const distance = Math.sqrt(
            (posEnd.x - posStart.x) ** 2 + (posEnd.y - posStart.y) ** 2,
          );

          const alpha_increment = 0.5 / distance;

          pos.x = posStart.x + (posEnd.x - posStart.x) * alpha;
          pos.y = posStart.y + (posEnd.y - posStart.y) * alpha;

          alpha += alpha_increment;
          if (alpha > 1) {
            alpha = 0;
            length = pathLength;
          }
        }
        setTransform({
          x: Math.max(Math.min(-pos.x + vpWidth / 2, 0), -(WIDTH - vpWidth)),
          y: Math.max(Math.min(-pos.y + vpHeight / 2, 0), -(HEIGHT - vpHeight)),
          length: length / pathLength,
          width: WIDTH,
          height: HEIGHT,
        });
        requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    })();
  }, [campaignMetaLoading, serverStateLoading]);

  return (
    <div
      className="relative h-full w-[inherit] overflow-hidden rounded-xl bg-white shadow-xl shadow-black transition-opacity duration-1000 ease-in-out"
      ref={baseRef}
    >
      <div
        className="relative"
        style={{
          width: transform.width,
          height: transform.height,
          minWidth: transform.width,
          minHeight: transform.height,
          transform: `translate(${transform.x}px, ${transform.y}px)`,
        }}
      >
        {serverStateLoading || campaignMetaLoading ? (
          <></>
        ) : (
          <img
            src={
              "/api/svg?fn=" +
              encodeURIComponent(
                "data/campaigns/" +
                  serverState!.campaign +
                  "/" +
                  campaignMeta!.map!.heroPath,
              )
            }
            className="absolute inset-0"
            alt="Karte"
          />
        )}
      </div>
      <div
        className="absolute bottom-4 right-4 text-xl font-bold uppercase"
        style={{
          filter: "drop-shadow(0 25px 25px rgb(1 1 1 / 0.15))",
        }}
      >
        Path of Heroes
      </div>
    </div>
  );
};
