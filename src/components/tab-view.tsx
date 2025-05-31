import React from "react";

export interface ITab {
  title: string;
  children: React.ReactNode;
}

export const Tab = (props: ITab) => {
  return <></>;
};

export const TabView = (props: {
  children: React.ReactElement<ITab>[] | React.ReactElement<ITab>;
}) => {
  const children = React.Children.toArray(
    props.children,
  ) as React.ReactElement<ITab>[];
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-french-800 shadow-2xl">
      {children.length > 1 ? (
        <div className="flex overflow-x-scroll shadow-2xl">
          {children.map((child, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={[
                "bg-french-800 p-2 px-4 text-lg text-white transition-all duration-100 hover:bg-french-900",
                activeTab === index ? "bg-french-900" : "",
              ].join(" ")}
            >
              {child.props.title}
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative grow">
        {children.map((child, index) => (
          <div
            key={index}
            className={[
              "linear absolute inset-0 transition-opacity duration-100",
              activeTab === index ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{
              pointerEvents: activeTab === index ? "auto" : "none",
            }}
          >
            <div className="h-full w-full overflow-y-scroll">
              {child.props.children}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
