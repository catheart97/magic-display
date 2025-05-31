"use client";

import { BattlemapOption } from "@/components/admin/battlemap-option";
import Calendar from "@/components/calendar";
import { NavBar } from "@/components/nav-bar";
import { PreviewImageOption } from "@/components/admin/preview-image-option";
import { PreviewTextOption } from "@/components/admin/preview-text-option";
import ProtectedPage from "@/components/protected-page";
import { ReferenceList } from "@/components/reference-list";
import { Tab, TabView } from "@/components/tab-view";
import { CampaignOption } from "@/components/admin/campaign-option";

export default () => {
  return (
    <ProtectedPage redirectURL="/admin">
      <div className="flex h-dvh w-dvw flex-col items-center bg-french-100">
        <NavBar title="Dungeon Master" />
        <div className="flex w-full grow justify-center overflow-y-scroll p-3">
          <TabView>
            <Tab title="Display Options">
              <div className="grid w-full grow grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex h-full w-full justify-between gap-2">
                  <BattlemapOption />
                  <PreviewImageOption />
                </div>
                <PreviewTextOption />
                <Calendar admin={true} />
                <CampaignOption />
              </div>
            </Tab>

            <Tab title="Quick References">
              <ReferenceList />
            </Tab>
          </TabView>
        </div>
      </div>
    </ProtectedPage>
  );
};
