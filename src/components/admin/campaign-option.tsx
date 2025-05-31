"use client";

import { useServerState } from "@/server/client-utility";
import { getAvailableCampaigns, updateServerState } from "@/server/server";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const CampaignOption = () => {
  const { serverState } = useServerState();

  const { data, isLoading } = useQuery({
    queryKey: ["availableCampaigns"],
    queryFn: async () => {
      const availableCampaigns = await getAvailableCampaigns();
      return availableCampaigns;
    },
  });

  if (!data || !serverState) return <></>;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-french-200 text-french-900">
      {data.map((campaign) => {
        return (
          <button
            key={campaign}
            className={[
              "flex h-10 w-full items-center justify-center",
              serverState.campaign === campaign
                ? "bg-french-800 text-french-100"
                : "",
            ].join(" ")}
            onClick={() => {
                updateServerState({
                    ...serverState,
                    campaign: campaign,
                })

            }}
          >
            {campaign}
          </button>
        );
      })}
    </div>
  );
};
