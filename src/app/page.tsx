import DefaultLayout from "../components/Layouts/DefaultLaout";
import { Metadata } from "next";

import React from "react";
import ECommerce from "../components/Dashboard/E-commerce";
export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}