"use client";

export const Searchbar = (props: {
  filter: string;
  setFilter: (filter: string) => void;
}) => {
  return (
    <div className="rounded-full pb-4">
      <input
        type="text"
        className="w-full rounded-full bg-french-200/20 p-2 px-4 text-white transition-colors duration-200 hover:bg-french-200/30 focus:outline-hidden"
        placeholder="Type to search..."
        value={props.filter}
        onChange={(e) => {
          props.setFilter(e.target.value);
        }}
      />
    </div>
  );
};
