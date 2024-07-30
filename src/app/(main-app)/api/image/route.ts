import fsExtra from "fs-extra";
import path from "path";

export const GET = async (req: Request) => {
  // read the img arg
  const { searchParams } = new URL(req.url);
  const { fn } = Object.fromEntries(searchParams.entries());

  // ensure the path starts with /data
  if (!fn.startsWith("data/")) {
    return new Response("Invalid path", { status: 400 });
  }

  try {
    const image = await fsExtra.readFile(fn);
    return new Response(image, {
      headers: {
        "Content-Type": "image/" + path.extname(fn).replace(".", ""),
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Image not found", { status: 404 });
  }
};
