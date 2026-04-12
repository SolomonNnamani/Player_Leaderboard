"use client";

import { GrTrophy } from "react-icons/gr";
import { FaSquareFull } from "react-icons/fa";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

export default function Nav() {
  const arr = [
    { icon: <IoGameControllerOutline />, label: "MATCHES", active:false },
    { icon: <FaUsers />, label: "PLAYERS", active:false },
    { icon: <MdLeaderboard />, label: "LEADERBOARD", active:true },
    { icon: <IoSettingsSharp />, label: "SETTING", active:false },
  ];
  return (
    <div>
      {/**Nav */}
      <div className="flex items-center justify-between m-7">
        {/**Scoreboard */}
        <div className="flex items-center gap-5 text-yellow-300 ">
          <GrTrophy />
          <p className="font-bold italic ">SCOREBOARD</p>
        </div>

        {/**Tablet nav */}
        <div className="hidden md:flex gap-5 ">
          {arr.map((a, i) => (
            <div key={i} className="cursor-pointer text-white/50">
              <p>{a.label} </p>
            </div>
          ))}
        </div>

        {/**Square */}
        <FaSquareFull className="text-blue-300 text-3xl" />
      </div>

      {/**For mobile */}

      <div className={`fixed left-3 right-3 bottom-5 z-50  flex justify-between text-xs sm:text  py-3 px-5 bg-white/10 backdrop-blur-md rounded-4xl md:hidden`}>
        {arr.map((a, i) => (
          <div key={i} className="cursor-pointer">
            <p className={`flex flex-col items-center justify-center ${a.active  ? "bg-blue-700 px-2 py-1 rounded-3xl" : ""}`}>{a.icon} <span>{a.label}</span></p>
           
          </div>
        ))}
      </div>
    </div>
  );
}
