export const Configuration: {
  battlemapURL: string;
  adminPassword: string;
  serverSecret: string;
} = {
  // leave this empty if you don't want to use the battlemap display
  // default is the encounter+ webclient which is expected to run on the same machine
  // battlemapURL: "https://www.dndbeyond.com/games/5825415?spectator=true",
  battlemapURL: "http://localhost:8080/client/?runMode=tv",
  adminPassword: "admin",
  serverSecret: "7ushakdhkjsa82",
};
