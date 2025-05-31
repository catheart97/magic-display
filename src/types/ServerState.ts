export type ServerState = {
  campaign: string;
  
  preview: {
    type: "image" | "text" | "battlemap" | "none";
    data: string; // base64 encoded image or text content
  }
};
