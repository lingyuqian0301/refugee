"use client";  
import DefaultLayout from "../components/Layouts/DefaultLaout";
import React from "react";
import OverviewPanel from "../components/OverviewPanel";
import Notifications from "../components/Notifications";
import QuickAccessLinks from "../components/QuickAccessLinks";
import DigitalWallet from "../components/DigitalWallet";  // Import the new wallet component

export default function Home() {
  return (
    <DefaultLayout>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-4 gap-3">
          {/* Left Column */}
          <div className="col-span-3">
            <OverviewPanel />
            {/* Digital Wallet Banner placed below the Overview Panel */}
            <div className="mt-6">
              <DigitalWallet />
            </div>
            <div className="mt-6">
              <QuickAccessLinks />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-1 space-y-6">
            <Notifications />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
