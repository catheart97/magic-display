import { Bona_Nova } from "next/font/google";
import "@/app/(main-app)/layout.css";
import "./layout.css"; // printing specific css
import { Providers } from "@/components/Providers";

const font = Bona_Nova({ subsets: ["latin", "latin-ext"], weight: "400" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="print h-a4paper">
      <head>
        <title>A4 Print - Magic Display</title>
      </head>
      <body className={[font.className, "h-a4paper print"].join(" ")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
