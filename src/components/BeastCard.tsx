import { Monster } from "@/types/5eTools/Bestiary";

export const Attribute = (props: { name: string; value: string }) => {
  const modifier = Math.floor((parseInt(props.value) - 10) / 2);
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border bg-white p-1 px-3 shadow">
      <div className="text-xs uppercase">{props.name.slice(0, 3)}</div>
      <div className="text-xl font-bold">{props.value} </div>
      <div className="text-xs">
        ({modifier >= 0 ? `+${modifier}` : modifier})
      </div>
    </div>
  );
};

// ! todo fix theses typings
export const speedsToList = (speeds: any) => {
  const list = [];
  if (speeds.walk && typeof speeds.walk === "number") {
    list.push(speeds.walk);
  }
  if (speeds.walk && typeof speeds.walk === "object") {
    list.push(`${speeds.walk.number} (${speeds.walk.condition})`);
  }
  if (speeds.fly && typeof speeds.fly === "number") {
    list.push(`Fly ${speeds.fly}`);
  }
  if (speeds.fly && typeof speeds.fly === "object") {
    list.push(`Fly ${speeds.fly.number} (${speeds.fly.condition})`);
  }
  if (speeds.swim) {
    list.push(`Swim ${speeds.swim}`);
  }
  if (speeds.climb) {
    list.push(`Climb ${speeds.climb}`);
  }
  if (speeds.burrow) {
    list.push(`Burrow ${speeds.burrow}`);
  }
  return list;
};

export const BeastCard = (props: { data: Monster }) => {
  return (
    <div className="flex h-full w-full flex-col items-center gap-1 rounded-xl p-2 shadow">
      <div className="flex h-full w-full flex-col items-center gap-2">
        <div className="w-full text-left text-2xl uppercase">
          {props.data.name}
        </div>
        <div>
          {/** @ts-ignore */}
          {props.data.source} p.{props.data.page}, {props.data.type}
        </div>

        <div className="grid w-full grid-cols-4 gap-2">
          <div className="flex w-full justify-center gap-1 rounded-full bg-white shadow">
            <i className="bi bi-shield-shaded"></i>
            {props.data.ac ? (
              <span>
                {typeof props.data.ac[0] === "number"
                  ? props.data.ac[0]
                  : props.data.ac[0].ac}
              </span>
            ) : (
              <span>?</span>
            )}
          </div>
          <div className="flex w-full justify-center gap-1 rounded-full bg-white shadow">
            <i className="bi bi-heart-fill"></i>
            {props.data.hp ? props.data.hp.average : "?"}
          </div>
          <div className="flex w-full justify-center gap-1 rounded-full bg-white shadow">
            <i className="bi bi-arrows-angle-expand"></i>
            {props.data.size ? props.data.size[0] : "?"}
          </div>
          <div className="flex w-full justify-center gap-1 rounded-full bg-white shadow">
            <i className="bi bi-star"></i>
            {props.data.cr
              ? typeof props.data.cr === "string"
                ? props.data.cr
                : props.data.cr.cr
              : "?"}
          </div>
        </div>

        {/** Attributes */}
        <div className="grid w-full grid-cols-6 gap-2">
          {props.data.str ? (
            <Attribute name="STR" value={props.data.str.toFixed(0)} />
          ) : null}
          {props.data.dex ? (
            <Attribute name="DEX" value={props.data.dex.toFixed(0)} />
          ) : null}
          {props.data.con ? (
            <Attribute name="CON" value={props.data.con.toFixed(0)} />
          ) : null}
          {props.data.int ? (
            <Attribute name="INT" value={props.data.int.toFixed(0)} />
          ) : null}
          {props.data.wis ? (
            <Attribute name="WIS" value={props.data.wis.toFixed(0)} />
          ) : null}
          {props.data.cha ? (
            <Attribute name="CHA" value={props.data.cha.toFixed(0)} />
          ) : null}
        </div>

        {/** Skills */}
        {props.data.skill ? (
          <div className="w-full">
            <a className="uppercase text-red-700">Skills</a>{" "}
            {Object.keys(props.data.skill!).map((skill, index) => (
              // @ts-ignore
              <span key={index}>
                {/** @ts-ignore */}
                {skill} {props.data.skill![skill]} &nbsp;
              </span>
            ))}
          </div>
        ) : null}

        {/** Resistances **/}
        {props.data.resist ? (
          <div className="w-full">
            <a className="uppercase text-red-700">Resistances</a>{" "}
            {props.data.resist!.join(", ")}
          </div>
        ) : null}

        {/** Immunities */}
        {props.data.immune ? (
          <div className="w-full">
            <a className="uppercase text-red-700">Immunities</a>{" "}
            {props.data.immune!.join(", ")}
          </div>
        ) : null}

        {/** Condition Immunities */}
        {props.data.conditionImmune ? (
          <div className="w-full">
            <a className="uppercase text-red-700">Condition Immunities</a>{" "}
            {props.data.conditionImmune!.join(", ")}
          </div>
        ) : null}

        {/** Senses */}
        {props.data.senses ? (
          <div className="w-full">
            <a className="uppercase text-red-700">Senses</a>{" "}
            {props.data.senses!.join(", ")}
          </div>
        ) : null}

        {/** Languages */}
        {props.data.languages && props.data.languages[0] != "-" ? (
          <div className="w-full">
            <a className="uppercase text-red-700">Languages</a>{" "}
            {props.data.languages!.join(", ")}
          </div>
        ) : null}

        {/** Speed */}
        {props.data.speed ? (
          <div className="w-full">
            <a className="uppercase text-red-700">Speed</a>{" "}
            {speedsToList(props.data.speed).join("ft, ") + "ft"}
          </div>
        ) : null}

        {/** Traits */}
        {props.data.trait ? (
          <div className="w-full">
            <a className="text-xl font-bold">Traits</a>
            {props.data.trait!.map((trait, index) => (
              <div key={index}>
                <a className="uppercase text-red-700">{trait.name}</a>{" "}
                {trait.entries.join(" ")}
              </div>
            ))}
          </div>
        ) : null}

        {/** Actions */}
        {props.data.action ? (
          <div className="w-full">
            <b className="text-xl">Actions</b>
            {props.data.action!.map((action, index) => (
              <div key={index}>
                <a className="uppercase text-red-700">{action.name}</a>{" "}
                {action.entries.join(" ")}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
