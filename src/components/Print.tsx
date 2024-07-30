export const A4Paper = (props: { children: React.ReactNode }) => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  return (
    <div
      className="a4paper bg-white"
      data-useragent={isSafari ? "" : "NotSafari"}
    >
      {props.children}
    </div>
  );
};
