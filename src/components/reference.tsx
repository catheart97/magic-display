import React from "react";

export interface IReference {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Reference = (props: IReference) => {
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div
      className={[
        "flex w-full shrink-0 flex-col overflow-hidden bg-neutral-100 transition-border duration-200 ease-in-out",
        height === 0 ? "rounded-3xl" : "rounded-xl shadow-2xl",
        props.className,
      ].join(" ")}
    >
      <button
        className={[
          "w-full p-2 px-3 text-left font-bold transition-[color,font-size] duration-200 hover:bg-neutral-400/30 focus:outline-hidden",
          height === 0 ? "text-base" : "text-2xl",
        ].join(" ")}
        onClick={() => {
          if (height === 0) {
            setHeight(ref.current?.scrollHeight || 0);
          } else {
            setHeight(0);
          }
        }}
      >
        {props.title}
      </button>
      <div
        ref={ref}
        className="duration-400 w-full overflow-hidden transition-[height] ease-in-out"
        style={{
          height: height,
        }}
      >
        <div className="flex h-fit w-full justify-center p-3 px-3">
          {props.children}
        </div>
      </div>
    </div>
  );
};
