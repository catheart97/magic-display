export const Widget = (
  props: {
    children: React.ReactNode;
    className?: string;
    title?: string;
  } & React.HTMLAttributes<HTMLDivElement>,
) => {
  return (
    <div
      {...props}
      className={[
        "relative flex shrink-0 flex-col overflow-hidden rounded-xl bg-french-800",
        props.className,
      ].join(" ")}
    >
      {props.title ? (
        <label className="p-2 text-end text-lg uppercase text-white">
          {props.title}
        </label>
      ) : null}
      {props.children}
    </div>
  );
};

export const WidgetGroup = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-8 overflow-y-scroll rounded-xl bg-french-900 shadow-2xl">
      {props.children}
    </div>
  );
};
