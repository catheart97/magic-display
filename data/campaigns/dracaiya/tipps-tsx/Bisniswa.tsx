import Ship from "./Ship.png";

export default () => {
  return (
    <>
      <div className="h-full grow relative">
        <img src={Ship.src} className="object-contain w-full h-full" />
        <div className="absolute inset-0 flex flex-col">
          <div className="grow w-full grid grid-cols-2 gap-16">
            <div className="grid grid-rows-4 p-3 gap-4">
              <div className="w-4/5 flex justify-center items-center rounded-xl bg-white/50 ml-auto border-2 border-black">
                Waffenkammer
              </div>
              <div className="row-span-2 w-4/5 rounded-xl bg-white/50 flex justify-center items-center border-2 border-black">
                - 2 -
              </div>
              <div className="w-4/5 flex justify-center items-center rounded-xl bg-white/50 ml-auto border-2 border-black">
                Händlerstation
              </div>
            </div>
            <div className="grid grid-rows-4 p-3 gap-4">
              <div className="w-4/5 flex justify-center items-center rounded-xl bg-white/50 mr-auto border-2 border-black">
                Goldschmiede
              </div>
              <div className="row-span-2 w-4/5 rounded-xl bg-white/50 flex justify-center items-center ml-auto border-2 border-black">
                - 2 -
              </div>
              <div className="w-4/5 flex justify-center items-center rounded-xl bg-white/50 mr-auto border-2 border-black">
                Arztkammer
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <a>Crew Modifier</a>
            <a className="text-purple-700">+2</a>
          </div>
        </div>
      </div>
      <div
        className="text-4xl pl-6 text-neutral-900 text-center uppercase"
        style={{
          writingMode: "vertical-rl",
        }}
      >
        Bisniswa
      </div>
    </>
  );
};
