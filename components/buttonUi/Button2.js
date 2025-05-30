import React from "react";

const Bt2 = ({ name, type = "button" }) => {
  return (
    <button
      type={type}
      className="relative flex cursor-pointer items-center justify-center gap-2 px-4 py-[0.3rem] text-white text-lg font-semibold rounded-full overflow-hidden border border-white/20 backdrop-blur-md bg-[#0A0D2D]/70 group hover:text-black transition duration-300 ease-in-out"
    >
      <span className="z-10">{name}</span>
      <span className="absolute inset-0 w-0 h-full bg-gray-200 transition-all duration-300 ease-in-out rounded-full group-hover:w-full z-0"></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 19"
        className="w-8 h-8 z-10 p-2 border border-gray-500 rounded-full bg-white text-black transform rotate-45 transition-transform duration-300 ease-in-out group-hover:rotate-[90deg]"
      >
        <path
          d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
          className="fill-black"
        />
      </svg>
    </button>
  );
};

export default Bt2;
