import type { Metadata } from "next";
import "../styles/globals.css";
import BurgerMenu from "@/components/layout/BurgerMenu";
import CustomCursor from "@/components/ui/DeerCursor";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = {
  title: "BAO DigitalDesign — Hugo Camart",
  description: "3D Surface Modelling, Rendering & Animation by Hugo Camart",
  keywords: ["3D design", "digital design", "modelling", "rendering", "portfolio"],
  openGraph: {
    title: "BAO DigitalDesign",
    description: "3D Surface Modelling, Rendering & Animation",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Loader />
        <CustomCursor />
        <BurgerMenu />
        <main>{children}</main>
      </body>
    </html>
  );
}