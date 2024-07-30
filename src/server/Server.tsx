"use server";

import { FantasyCalendarDate } from "@/types/FantasyCalendar";
import { ServerState } from "@/types/ServerState";
import fs from "fs-extra";
import { Campaign, PartyDisplayData } from "../types/Campaign";
import { MarkdownElement } from "../types/MarkdownElement";
import {
  loadCampaignData,
  loadServerState,
  storeCampaignData,
  storeServerState,
} from "./ServerUtility";

export const getTimeFromServer = async () => {
  const campaignData = await loadCampaignData();
  return campaignData?.calendar?.currentDate;
};

export const setTimeOnServer = async (time: FantasyCalendarDate) => {
  const serverState = await loadServerState();
  const campaignData = await loadCampaignData();
  if (!campaignData && !campaignData!.calendar) {
    return;
  }
  campaignData!.calendar!.currentDate = time;
  storeCampaignData(serverState, campaignData!);
};

const getMarkdownEntries = async (p: string) => {
  let entries: string[] = fs.readdirSync(p);
  entries = entries.filter((entry) => {
    return entry.endsWith(".md");
  });
  const mappedEntries = entries.map((entry) => {
    return {
      title: entry.replace(".md", ""),
      path: p.replace("public", "") + entry,
    };
  });
  return mappedEntries as Array<MarkdownElement>;
};

export const getReferenceEntries = async () => {
  return await getMarkdownEntries("data/reference/");
};

export const getTipps = async () => {
  const generalTipps = await getMarkdownEntries("data/tipps/");

  const campaignData = await loadCampaignData();
  const serverState = await loadServerState();

  if (!campaignData) {
    return generalTipps;
  }
  try {
    const campaignTipps = await getMarkdownEntries(
      "data/campaigns/" + serverState.campaign + "/md-tipps/",
    );

    return [...generalTipps, ...campaignTipps];
  } catch (e) {
    return generalTipps;
  }
};

export const getTSXTipps = async () => {
  const serverState = await loadServerState();
  const basePath = "data/campaigns/" + serverState.campaign + "/tipps-tsx/";
  let entries: string[] = fs.readdirSync(basePath);
  entries = entries.filter((entry) => {
    return entry.endsWith(".tsx");
  });
  return entries.map((entry) => {
    return basePath + entry;
  });
};

export const getBackgrounds = async () => {
  const serverState = await loadServerState();
  let images = fs.readdirSync(
    "data/campaigns/" + serverState.campaign + "/backgrounds",
  );
  images = images.filter((image) => {
    return image.toLowerCase().endsWith(".png");
  });
  return images.map((image) => {
    return "data/campaigns/" + serverState.campaign + "/backgrounds/" + image;
  });
};

export const getDiashowImages = async () => {
  // return all images in data/campaigns/<campaign>/diashow
  const serverState = await loadServerState();
  let images = fs.readdirSync(
    "data/campaigns/" + serverState.campaign + "/diashow",
  );
  images = images.filter((image) => {
    return image.toLowerCase().endsWith(".jpg");
  });
  return images.map((image) => {
    return "data/campaigns/" + serverState.campaign + "/diashow/" + image;
  });
};

export const getServerState = async () => {
  const serverState = loadServerState();
  return serverState;
};

export const updateServerState = async (state: Partial<ServerState>) => {
  let serverState = await loadServerState();
  serverState = {
    ...serverState,
    ...state,
  };
  storeServerState(serverState);
};

export const getCampaignData = async () => {
  return await loadCampaignData();
};

export const updateCampaignData = async (data: Partial<Campaign>) => {
  const serverState = await loadServerState();
  let campaignData = await loadCampaignData();
  if (!campaignData) {
    return;
  }

  campaignData = {
    ...campaignData!,
    ...data,
  };
  storeCampaignData(serverState, campaignData);
};

export const storePartyData = async (data: PartyDisplayData) => {
  const campaignData = await loadCampaignData();
  if (!campaignData) {
    return;
  }
  campaignData.displayData = data;
  storeCampaignData(await loadServerState(), campaignData);
};
