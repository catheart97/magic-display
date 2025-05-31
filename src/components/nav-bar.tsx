"use client";
import { Logo } from "./logo";

export const NavBar = (props: { title: string }) => (
  <nav className="flex h-24 w-full items-center justify-between p-4 py-8">
    <a href="/" target="_blank">
      <Logo />
    </a>
    <div className="hidden shrink grow md:block"></div>
    <div className="flex flex-col items-end justify-center">
      <h1 className="text-end text-4xl text-french-900">{props.title}</h1>
    </div>
  </nav>
);
