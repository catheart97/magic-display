import { useQuery } from "@tanstack/react-query";
import { getCampaignData, getServerState } from "./Server";
import {
  getCampaignDataLastUpdate,
  getServerStateLastUpdate,
} from "./ServerUtility";

let serverStateUpdateTime: number | undefined = undefined;
export const useServerState = (once?: boolean) => {
  const { data, refetch } = useQuery({
    queryKey: ["serverState"],
    queryFn: async () => {
      return await getServerState();
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
    refetchInterval: 100,
  });

  return { serverState: data, isLoading: data === undefined };
};

let campaignDataUpdateTime: number | undefined = undefined;
export const useCampaignData = (once?: boolean) => {
  const { data, refetch } = useQuery({
    queryKey: ["campaignData"],
    queryFn: async () => {
      return await getCampaignData();
    },
    enabled: false,
  });

  useQuery({
    queryKey: ["campaignDataLastUpdate"],
    queryFn: async () => {
      const serverLastUpdated = await getCampaignDataLastUpdate();
      const clientLastUpdated = campaignDataUpdateTime;
      campaignDataUpdateTime = serverLastUpdated;
      if (clientLastUpdated !== serverLastUpdated) {
        refetch();
        return true;
      }
      return false;
    },
    refetchInterval: 100,
  });

  return { campaignData: data, isLoading: data === undefined };
};
