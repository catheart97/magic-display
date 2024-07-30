import React from "react";

export const Aspect1Element = (
  props: React.HTMLAttributes<HTMLImageElement>,
) => {
  return (
    <img
      {...props}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2NkYGD4DwABBAEAHcJN/AAAAABJRU5ErkJggg=="
      className={"aspect-1 opacity-0 " + (props.className ?? "")}
    />
  );
};
