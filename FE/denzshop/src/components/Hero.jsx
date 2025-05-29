import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import animasi1 from "../assets/FirstAnimation.json";
import animasi2 from "../assets/SecondAnimation.json";
import animasi3 from "../assets/ThirdAnimation.json";

const animasi = [animasi1, animasi2, animasi3];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % animasi.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-100 pt-32 pb-16">
      <div className="max-w-[100rem] mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* section kiri */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-4">
            Selamat datang di <span className="text-black">Denz</span>Shop
          </h2>
          <p className="text-gray-700 mb-6">Temukan produk terbaik dengan harga terbaik, langsung dari rumahmu</p>
          <Link to="/product" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition">
            Lihat Produk
          </Link>
        </motion.div>

        {/* section kanan */}
        <div className="flex-1 flex justify-end items-center relative h-[350px] max-w-[400px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className={`absolute w-full h-full ${index === 2 ? "scale-[0.80]" : "scale-125"}`}
            >
              <Lottie animationData={animasi[index]} loop />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Hero;
