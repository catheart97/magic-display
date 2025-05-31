import { Bona_Nova } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/app/layout.css";

const font = Bona_Nova({ subsets: ["latin", "latin-ext"], weight: "400" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={font.className}>{children}</body>
      </Providers>
    </html>
  );
}
