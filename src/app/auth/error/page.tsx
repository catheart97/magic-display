"use client";

import { NavBar } from "@/components/nav-bar";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ErrorDisplay = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? false;

  if (!error) {
    return <></>;
  }

  return <label className="rounded-full font-bold text-red-800">{error}</label>;
};

export default () => {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center bg-french-100">
      <NavBar title="Error" />
      <div className="container">
        <Suspense fallback={<></>}>
          <ErrorDisplay />
        </Suspense>
      </div>
    </div>
  );
};
