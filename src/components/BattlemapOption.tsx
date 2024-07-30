"use client";

import { updateServerState } from "@/server/Server";
import { useCampaignData, useServerState } from "@/server/ClientUtility";
import React from "react";

export const BattlemapOption = () => {
  const { serverState, isLoading } = useServerState();
  return (
    <div className="p-2">
      <button
        className={[
          "h-full w-full whitespace-nowrap rounded-xl p-2 text-center text-white transition-all duration-300 ease-in-out hover:scale-110",
          !isLoading && serverState!.battlemapVisible
            ? "bg-green-500"
            : "bg-red-500",
        ].join(" ")}
        onClick={() => {
          if (!isLoading) {
            serverState!.battlemapVisible = !serverState!.battlemapVisible;
            updateServerState(serverState!);
          }
        }}
      >
        &nbsp;
        {!isLoading && serverState!.battlemapVisible ? (
          <i className="bi bi-eye"></i>
        ) : (
          <i className="bi bi-eye-slash"></i>
        )}
        &nbsp;&nbsp;<i className="bi bi-map"></i>&nbsp;
      </button>
    </div>
  );
};
