"use client";

import { updateServerState } from "@/server/server";
import { useServerState } from "@/server/client-utility";
import React from "react";

export const BattlemapOption = () => {
  const { serverState, isLoading } = useServerState();
  return (
    <div className="">
      <button
        className={[
          "h-full w-full whitespace-nowrap rounded-xl p-2 text-center text-white transition-all duration-300 ease-in-out hover:scale-110",
          !isLoading && serverState!.preview.type === "battlemap"
            ? "bg-green-500"
            : "bg-red-500",
        ].join(" ")}
        onClick={() => {
          if (!isLoading) {
            if (serverState!.preview.type === "battlemap") {
              serverState!.preview.type = "none";
            } else {
              serverState!.preview.type = "battlemap";
            }
            updateServerState(serverState!);
          }
        }}
      >
        &nbsp;
        {!isLoading && serverState!.preview.type == "battlemap" ? (
          <i className="bi bi-eye"></i>
        ) : (
          <i className="bi bi-eye-slash"></i>
        )}
        &nbsp;&nbsp;<i className="bi bi-map"></i>&nbsp;
      </button>
    </div>
  );
};
