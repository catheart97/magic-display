"use client";

// tmp http://localhost:3000/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fadmin

import React, { FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { NavBar } from "@/components/nav-bar";
import { useSearchParams } from "next/navigation";

const ErrorDisplay = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? false;

  if (!error) {
    return <></>;
  }

  return (
    <label className="rounded-full font-bold text-red-800">
      Incorrect password.
    </label>
  );
};

export default () => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    await signIn("credentials", { password, callbackUrl: "/admin" });
  };

  return (
    <div className="flex h-dvh w-dvw flex-col">
      <NavBar title="Log In" />
      <div className="flex grow flex-col items-center justify-center gap-2 pb-24">
        <Suspense fallback={<></>}>
          <ErrorDisplay />
        </Suspense>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col rounded-xl bg-french-700 p-4 shadow-2xl"
        >
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-full bg-french-100 p-2 px-4 text-french-900 placeholder-french-800 focus:outline-hidden focus:ring-2 focus:ring-french-200"
            placeholder="Type in your password..."
          />
          <hr className="my-2 opacity-20" />
          <button
            type="submit"
            className="pointer-events-all pointer-events-auto cursor-pointer rounded-full bg-french-300 p-2 px-4 text-french-900 transition-all duration-300 ease-in-out hover:bg-french-400 focus:outline-hidden focus:ring-2 focus:ring-french-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};
