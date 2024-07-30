"use client";
import React from "react";
import { easeOutExpo as ease } from "easing-utils";

export const CardStack = (props: {
  children: React.ReactNode[] | React.ReactNode;
  speed?: number;
}) => {
  const interval = React.useRef<NodeJS.Timeout>();
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
        const alpha = ease((ni - 1) / (children.length - 1));
        const falpha = ease((ni - 1) / children.length);

        return (
          <div
            key={i}
            className="absolute transition-all duration-500 ease-in-out"
            style={{
              width: "90%",
              height: "100%",
              transform: `
                                translateX(${35.5 * alpha}%) 
                                scale(${1 - 0.5 * falpha})
                                `,
              zIndex: children.length - ni,
              opacity: ni === 0 ? 0 : 1,
            }}
          >
            <div className="h-full w-full rounded-xl shadow-2xl shadow-black">
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
};
