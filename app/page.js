"use client"
import React, { useEffect, useState } from "react";
import HeroSection from "@/components/Main"; // your actual app component
import Footer from "@/components/footer";
import { usePathname } from "next/navigation";


const App = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      <HeroSection />
      {!isAdmin && <Footer />}
    </>
  );  
};

export default App;
