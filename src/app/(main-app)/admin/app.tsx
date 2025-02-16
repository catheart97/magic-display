"use client";

import { BattlemapOption } from "@/components/BattlemapOption";
import { Widget, WidgetGroup } from "@/components/Widget";
import { ReferenceEntryList } from "@/components/ReferenceEntryList";
import { PreviewImageOption } from "@/components/PreviewImageOption";
import { PartyOverview } from "@/components/PartyOverview";
import React from "react";
import { Shop } from "@/components/Shop";
import { PreviewTextOption } from "@/components/PreviewTextOption";
import { NavBar } from "@/components/NavBar";
import { Tab, TabView } from "@/components/TabView";
import ProtectedPage from "@/components/ProtectedPage";
import { Compendium } from "@/components/Compendium";
import { Metadata } from "next";
import Calendar from "@/components/Calendar";

export default () => {
  return (
    <ProtectedPage redirectURL="/admin">
      <div className="flex h-[100dvh] w-[100dvw] flex-col items-center bg-french-100">
        <NavBar title="Dungeon Master" />
        <div className="flex w-full grow justify-center overflow-y-scroll p-3">
          <TabView>
            <Tab title="Display Options">
              <div className="flex w-full justify-between">
                <BattlemapOption />
                <PreviewImageOption />
              </div>
              <PreviewTextOption />
              <div className="flex w-full justify-center">
                <div className="relative w-96 h-96">
                  <Calendar admin={true} />
                </div>
              </div>
            </Tab>

            <Tab title="Shop">
              <Shop />
            </Tab>

            <Tab title="References">
              <ReferenceEntryList />
            </Tab>

            <Tab title="Compendium">
              <div className="flex h-full w-full flex-col items-center justify-center">
                <Compendium />
              </div>
            </Tab>
          </TabView>
        </div>
      </div>
    </ProtectedPage>
  );
};
