"use server";

import fs from "fs-extra";
import { Campaign } from "../types/Campaign";
import { ServerState } from "@/types/ServerState";

const SERVER_STORAGE = "data/server.json";

let __cache__serverStateLastUpdate = new Date().getTime();
let __cache__campaignDataLastUpdate = new Date().getTime();
let __cache__campaignData: Campaign | undefined = undefined;
let __cache__serverState: ServerState | undefined = undefined;

export const loadServerState = async () => {
  if (__cache__serverState) {
    return __cache__serverState;
  }

  let serverState: ServerState = {
    battlemapVisible: false,
    previewImage: "",
    previewText: "",
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

export const loadCampaignData = async () => {
  if (__cache__campaignData) {
    return __cache__campaignData;
  }

  let serverState = await loadServerState();
  let campaignData: Campaign | undefined = undefined;
  // check if campaign exists and load meta of that campaign
  if (fs.existsSync("data/campaigns/" + serverState.campaign + "/meta.json")) {
    campaignData = JSON.parse(
      fs
        .readFileSync("data/campaigns/" + serverState.campaign + "/meta.json")
        .toString(),
    );
    if (campaignData?.displayData.foregroundActives === undefined) {
      campaignData!.displayData.foregroundActives = {};
    }
    if (campaignData!.displayData.backgroundIndex === undefined) {
      campaignData!.displayData.backgroundIndex = 0;
    }

    const abstractPlayers = [
      ...campaignData!.players,
      ...campaignData!.playerNPCs,
    ];

    for (let player of abstractPlayers) {
      if (!campaignData!.displayData.foregroundActives[player.name]) {
        // find default image path
        let path = "";
        let keys = Object.keys(player.images.keyed);
        for (let key of keys) {
          for (const elem of player.images.keyed[key]) {
            if (elem.name === "") {
              path = elem.path;
              break;
            }
          }
        }
        campaignData!.displayData.foregroundActives![player.name] = path;
      }
    }
  }
  return campaignData;
};

export const storeCampaignData = async (
  serverState: ServerState,
  campaignData: Campaign,
) => {
  fs.writeFileSync(
    "data/campaigns/" + serverState.campaign + "/meta.json",
    JSON.stringify(campaignData),
  );
  __cache__campaignDataLastUpdate = new Date().getTime();
  __cache__campaignData = campaignData;
};

export const storeServerState = async (serverState: ServerState) => {
  if (
    __cache__serverState !== undefined &&
    serverState.campaign !== __cache__serverState.campaign
  ) {
    // clear campaign data cache
    __cache__campaignData = undefined;
  }
  fs.writeFileSync(SERVER_STORAGE, JSON.stringify(serverState));
  __cache__serverStateLastUpdate = new Date().getTime();
  __cache__serverState = serverState;
};

export const getServerStateLastUpdate = async () => {
  return __cache__serverStateLastUpdate;
};

export const getCampaignDataLastUpdate = async () => {
  return __cache__campaignDataLastUpdate;
};
