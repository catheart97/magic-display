import Ship from "./ship.svg";

export default () => {
  return (
    <>
      <div className="relative h-full grow">
        <img
          src={Ship.src}
          className="h-full w-full object-contain opacity-20"
        />
        <div className="absolute inset-0 flex flex-col">
          <div className="grid w-full grow grid-cols-2 gap-16">
            <div className="grid grid-rows-4 gap-4 p-3">
              <div className="ml-auto flex w-4/5 items-center justify-center rounded-xl border-2 border-black bg-white/50">
                Waffenkammer
              </div>
              <div className="row-span-2 flex w-4/5 items-center justify-center rounded-xl border-2 border-black bg-white/50">
                - 2 -
              </div>
              <div className="ml-auto flex w-4/5 items-center justify-center rounded-xl border-2 border-black bg-white/50">
                Händlerstation
              </div>
            </div>
            <div className="grid grid-rows-4 gap-4 p-3">
              <div className="mr-auto flex w-4/5 items-center justify-center rounded-xl border-2 border-black bg-white/50">
                Goldschmiede
              </div>
              <div className="row-span-2 ml-auto flex w-4/5 items-center justify-center rounded-xl border-2 border-black bg-white/50">
                - 2 -
              </div>
              <div className="mr-auto flex w-4/5 items-center justify-center rounded-xl border-2 border-black bg-white/50">
                Arztkammer
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <a>Crew Modifier</a>
            <a className="text-purple-700">+1</a>
          </div>
        </div>
      </div>
      <div
        className="pl-6 text-center text-4xl uppercase text-neutral-900"
        style={{
          writingMode: "vertical-rl",
        }}
      >
        Bisniswa
      </div>
    </>
  );
};
