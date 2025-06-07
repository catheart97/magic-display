"use server";

import fs from "fs-extra";
import { CampaignMeta } from "../types/CampaignMeta";
import { ServerState } from "@/types/ServerState";
import { CampaignState } from "@/types/CampaignState";

const SERVER_STORAGE = "data/server.json";

let __cache__serverStateLastUpdate = new Date().getTime();
let __cache__campaignMetaLastUpdate = new Date().getTime();
let __cache__campaignStateLastUpdate = new Date().getTime();
let __cache__campaignMeta: CampaignMeta | undefined = undefined;
let __cache__campaignState: CampaignState | undefined = undefined;
let __cache__serverState: ServerState | undefined = undefined;

export const loadCampaignState = async () => {
  if (__cache__campaignState) {
    return __cache__campaignState;
  }

  const serverState = await loadServerState();

  let campaignState: CampaignState = {
    currentDate: { // if calendar is not set this is ignored
      year: 1,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
    },
  };

  if (fs.existsSync("data/campaigns/" + serverState.campaign + "/state.json")) {
    campaignState = JSON.parse(
      fs.readFileSync("data/campaigns/" + serverState.campaign + "/state.json").toString(),
    );
  }

  __cache__campaignStateLastUpdate = new Date().getTime();
  __cache__campaignState = campaignState;
  return campaignState;
};

export const storeCampaignState = async (campaignState: CampaignState) => {
  const serverState = await loadServerState();
  fs.writeFileSync(
    "data/campaigns/" + serverState.campaign + "/state.json",
    JSON.stringify(campaignState, null, 2),
  );
  __cache__campaignStateLastUpdate = new Date().getTime();
  __cache__campaignState = campaignState;
};

export const loadServerState = async () => {
  if (__cache__serverState) {
    return __cache__serverState;
  }

  let serverState: ServerState = {
    preview: {
      type: "none",
      data: ""
    },
    campaign: "dracaiya",
  };

  if (fs.existsSync(SERVER_STORAGE)) {
    serverState = {
      ...serverState,
      ...JSON.parse(fs.readFileSync(SERVER_STORAGE).toString()),
    };
  }

  __cache__serverState = serverState;
  return serverState;
};

export const loadCampaignMeta = async () => {
  if (__cache__campaignMeta) {
    return __cache__campaignMeta;
  }

  let serverState = await loadServerState();
  let campaignMeta: CampaignMeta | undefined = undefined;
  // check if campaign exists and load meta of that campaign
  if (fs.existsSync("data/campaigns/" + serverState.campaign + "/meta.json")) {
    campaignMeta = JSON.parse(
      fs
        .readFileSync("data/campaigns/" + serverState.campaign + "/meta.json")
        .toString(),
    );
  }
  return campaignMeta;
};

export const storeCampaignMeta = async (
  serverState: ServerState,
  campaignMeta: CampaignMeta,
) => {
  fs.writeFileSync(
    "data/campaigns/" + serverState.campaign + "/meta.json",
    JSON.stringify(campaignMeta),
  );
  __cache__campaignMetaLastUpdate = new Date().getTime();
  __cache__campaignMeta = campaignMeta;
};

export const storeServerState = async (serverState: ServerState) => {
  if (
    __cache__serverState !== undefined &&
    serverState.campaign !== __cache__serverState.campaign
  ) {
    // clear campaign data cache
    __cache__campaignMeta = undefined;
  }
  fs.writeFileSync(SERVER_STORAGE, JSON.stringify(serverState));
  __cache__serverStateLastUpdate = new Date().getTime();
  __cache__serverState = serverState;
};

export const getServerStateLastUpdate = async () => {
  return __cache__serverStateLastUpdate;
};

export const getCampaignMetaLastUpdate = async () => {
  return __cache__campaignMetaLastUpdate;
};

export const getCampaignStateLastUpdate = async () => {
  return __cache__campaignStateLastUpdate;
};