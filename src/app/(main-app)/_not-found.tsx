import { NavBar } from "@/components/NavBar";

export default () => (
  <div className="flex h-[100dvh] w-[100dvw] flex-col">
    <NavBar title="404" />
    <div className="flex grow items-center justify-center pb-24 text-2xl">
      The page you are looking for does not exist.
    </div>
  </div>
);
