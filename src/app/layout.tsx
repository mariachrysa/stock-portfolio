import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "React Portfolio Exercise",
  description:
    "A guided React learning project using fictional stock data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
            <header className="border-b pb-4">
              <p className="font-semibold">
                React learning project
              </p>

              <p className="text-sm text-muted-foreground">
                Demonstration data only —
                not live market prices.
              </p>
            </header>

            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}