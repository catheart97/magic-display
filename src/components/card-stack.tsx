"use client";
import React from "react";
import { easeOutExpo as ease } from "easing-utils";

export const CardStack = (props: {
  children: React.ReactNode[] | React.ReactNode;
  speed?: number;
  swap?: boolean;
}) => {
  const interval = React.useRef<NodeJS.Timeout>(undefined);
  const children = React.Children.toArray(props.children);
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  React.useEffect(() => {
    interval.current = setInterval(() => {
      setActiveIndex((activeIndex) => (activeIndex + 1) % children.length);
    }, props.speed || 5000);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [children.length, props.speed]);

  React.useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full min-w-full">
      {children.map((child, i) => {
        const ni = (children.length + i - activeIndex + 1) % children.length;
        let alpha = ease((ni - 1)**2 / (children.length)**2);
        let falpha = ease((ni - 1)**2 / children.length**2);

        if (props.swap) {
          // alpha = 1 - alpha;
          // falpha = 1 - falpha;
        }

        return (
          <div
            key={i}
            className="absolute transition-all duration-500 ease-in-out"
            style={{
              left: props.swap ? "10%" : "0%",
              width: "90%",
              height: "100%",
              transform: ` translateX(${(props.swap ? -35.5 : 35.5) * alpha}%) scale(${1 - 0.5 * falpha})
                          `,
              zIndex: ni == 0 ? 0 : children.length - ni,
              opacity: ni === 0 ? 0 : 1,
            }}
          >
            <div className="h-full w-full rounded-3xl shadow-2xl shadow-black">
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
};
