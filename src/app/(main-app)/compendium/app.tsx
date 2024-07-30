"use client";

import { Compendium } from "@/components/Compendium";
import { NavBar } from "@/components/NavBar";

export default () => {
  return (
    <div className="flex h-[100dvh] w-[100dvw] flex-col">
      <NavBar title="Compendium" />
      <Compendium />
    </div>
  );
};
