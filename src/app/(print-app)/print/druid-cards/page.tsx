"use client";

import { A4Paper } from "@/components/Print";

import { getBestiary } from "@/server/Database";
import React from "react";

import { BeastCard } from "@/components/BeastCard";
import { Monster } from "@/types/5eTools/Bestiary";

class ComponentToPrint extends React.PureComponent<
  {},
  {
    monster: Monster[];
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      monster: [],
    };
  }

  componentDidMount(): void {
    getBestiary().then((data) => {
      this.setState({
        monster: data
          .filter((m) => {
            return (
              (m.type === "beast" || m.type === "elemental") &&
              m.cr &&
              parseInt(typeof m.cr === "string" ? m.cr : m.cr.cr) <= 6
            );
          })
          .toSorted(
            (a, b) =>
              // sort first by cr, then by name
              parseInt(typeof a.cr === "string" ? a.cr : a.cr!.cr) -
                parseInt(typeof b.cr === "string" ? b.cr : b.cr!.cr) ||
              a.name.localeCompare(b.name),
          ),
      });
    });
  }

  render() {
    const BeastDBClone = (this.state.monster || []).filter((m) => {
      // Monsters Manual
      // Mordenkainens Monsters of the Multiverse
      // Tasha's Cauldron of Everything
      // Volo's Guide to Monsters
      // Xanathar's Guide to Everything
      if (
        m.source == "MM" ||
        m.source == "MPMM" ||
        m.source == "TCE" ||
        m.source == "VGM" ||
        m.source == "XGE"
      ) {
        return true;
      }
      return false;
    });

    const pages: Array<Array<Monster>> = [];
    const perPage = 6;
    for (let i = 0; i < BeastDBClone.length; i += perPage) {
      pages.push(BeastDBClone.slice(i, i + perPage));
    }

    return (
      <>
        {pages.map((page, index) => (
          <A4Paper key={index}>
            <div className="h-full w-full p-4">
              <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-4">
                {page.map((beast, i) => (
                  <BeastCard data={beast} key={i} />
                ))}
              </div>
            </div>
          </A4Paper>
        ))}
      </>
    );
  }
}

export default () => {
  const pageRef = React.useRef(null);

  return <ComponentToPrint ref={pageRef} />;
};
