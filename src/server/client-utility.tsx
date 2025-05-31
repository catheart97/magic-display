import { useQuery } from "@tanstack/react-query";
import { fetchCampaignMeta, fetchCampaignState, fetchServerState } from "./server";
import {
  getCampaignMetaLastUpdate,
  getServerStateLastUpdate,
} from "./server-utility";

let serverStateUpdateTime: number | undefined = undefined;
export const useServerState = (once?: boolean) => {
  const { data, refetch } = useQuery({
    queryKey: ["serverState"],
    queryFn: async () => {
      return await fetchServerState();
    },
    enabled: false,
  });

  useQuery({
    queryKey: ["serverStateLastUpdate"],
    queryFn: async () => {
      const serverLastUpdated = await getServerStateLastUpdate();
      const clientLastUpdated = serverStateUpdateTime;
      serverStateUpdateTime = serverLastUpdated;
      if (clientLastUpdated !== serverLastUpdated) {
        refetch();
        return true;
      }
      return false;
    },
    refetchInterval: 500,
  });

  return { serverState: data, isLoading: data === undefined };
};

let campaignMetaUpdateTime: number | undefined = undefined;
export const useCampaignMeta = (once?: boolean) => {
  const { data, refetch } = useQuery({
    queryKey: ["campaignMeta"],
    queryFn: async () => {
      return await fetchCampaignMeta();
    },
    enabled: false,
  });

  useQuery({
    queryKey: ["campaignMetaLastUpdate"],
    queryFn: async () => {
      const serverLastUpdated = await getCampaignMetaLastUpdate();
      const clientLastUpdated = campaignMetaUpdateTime;
      campaignMetaUpdateTime = serverLastUpdated;
      if (clientLastUpdated !== serverLastUpdated) {
        refetch();
        return true;
      }
      return false;
    },
    // refetchInterval: 100,
  });

  return { campaignMeta: data, isLoading: data === undefined };
};

let campaignStateUpdateTime: number | undefined = undefined;
export const useCampaignState = (once?: boolean) => {
  const { data, refetch } = useQuery({
    queryKey: ["campaignState"],
    queryFn: async () => {
      return await fetchCampaignState();
    },
    enabled: false,
  });

  useQuery({
    queryKey: ["campaignStateLastUpdate"],
    queryFn: async () => {
      const serverLastUpdated = await getCampaignMetaLastUpdate();
      const clientLastUpdated = campaignStateUpdateTime;
      campaignStateUpdateTime = serverLastUpdated;
      if (clientLastUpdated !== serverLastUpdated) {
        refetch();
        return true;
      }
      return false;
    },
    refetchInterval: 500,
  });

  return { campaignState: data, isLoading: data === undefined };
};
