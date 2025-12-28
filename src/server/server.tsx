"use server";

import { FantasyCalendarDate } from "@/types/FantasyCalendar";
import { ServerState } from "@/types/ServerState";
import fs from "fs-extra";
import { CampaignMeta } from "../types/CampaignMeta";
import { MarkdownElement } from "../types/MarkdownElement";
import {
  loadCampaignMeta,
  loadCampaignState,
  loadServerState,
  storeCampaignMeta,
  storeCampaignState,
  storeServerState,
} from "./server-utility";
import { CampaignState } from "@/types/CampaignState";

//////////////////////////////
// Static Server Data ///////////////////
//////////////////////////////
export const getAvailableCampaigns = async () => {
  // return all campaigns in data/campaigns
  const campaigns = fs.readdirSync("data/campaigns");
  return campaigns.filter((campaign) => {
    return fs.existsSync("data/campaigns/" + campaign + "/meta.json");
  });
}


export const getDiashowImages = async () => {
  // return all images in data/campaigns/<campaign>/diashow
  const serverState = await loadServerState();
  let images = fs.readdirSync(
    "data/campaigns/" + serverState.campaign + "/diashow",
  );
  images = images.filter((image) => {
    return image.toLowerCase().endsWith(".jpg") || image.toLowerCase().endsWith(".png");
  });
  // shuffle images
  images.sort(() => Math.random() - 0.5);
  return images.map((image) => {
    return "data/campaigns/" + serverState.campaign + "/diashow/" + image;
  })
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

  const campaignMeta = await loadCampaignMeta();
  const serverState = await loadServerState();

  if (!campaignMeta) {
    return generalTipps;
  }
  try {
    const campaignTipps = await getMarkdownEntries(
      "data/campaigns/" + serverState.campaign + "/tipps/",
    );

    return [ ...campaignTipps, ...generalTipps];
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

//////////////////////////////////
// Dynamic Server Data ///////////////////
//////////////////////////////////

export const fetchCampaignState = async () => {
  return await loadCampaignState();
};

export const updateCampaignState = async (state: Partial<CampaignState>) => {
  let campaignState = await loadCampaignState();
  if (!campaignState) {
    return;
  }
  campaignState = {
    ...campaignState,
    ...state,
  };
  await storeCampaignState(campaignState);
};

export const fetchServerState = async () => {
  const serverState = await loadServerState();
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

export const fetchCampaignMeta = async () => {
  return await loadCampaignMeta();
};

export const updateCampaignMeta = async (data: Partial<CampaignMeta>) => {
  const serverState = await loadServerState();
  let campaignMeta = await loadCampaignMeta();
  if (!campaignMeta) {
    return;
  }

  campaignMeta = {
    ...campaignMeta!,
    ...data,
  };
  storeCampaignMeta(serverState, campaignMeta);
};