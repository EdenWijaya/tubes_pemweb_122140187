import React from "react";
import Hero from "../components/Hero";
import ProdukUnggulan from "../components/ProdukUnggulan";
import Pilihan from "../components/Pilihan";
import Footer from "../components/Footer";

const Beranda = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <ProdukUnggulan />
      <Pilihan />
      <Footer />
    </div>
  );
};

export default Beranda;
