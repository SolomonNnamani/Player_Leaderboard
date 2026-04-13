"use client";

import { useState, useEffect } from "react";
import { MdOutlineStarBorder } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Stats = {
  total_players: number;
  highest_score: number;
  average_score: number;
};

export default function Snapshot() {
  const [stats, setStats] = useState<Stats>({
    total_players: 0,
    highest_score: 0,
    average_score: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/players/stats`);
        const data = await res.json();
        if (data.success) {
          setStats(data);
        }
      } catch (err) {
        console.log("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  const snapshot = [
    {
      icon: <FaUserFriends />,
      label: "TOTAL PLAYERS",
      number: stats.total_players,
      borderColor: "rgba(255, 215, 0, 0.4)",
    },
    {
      icon: <MdOutlineStarBorder />,
      label: "HIGHEST SCORE",
      number: stats.highest_score,
      borderColor: "rgba(34, 211, 238, 0.5)",
    },
    {
      icon: <FaRegChartBar />,
      label: "AVERAGE SCORE",
      number: stats.average_score.toFixed(1),
      borderColor: "rgba(168, 85, 247, 0.5)",
    },
  ];
  return (
    <div className="mx-4 md:mx-12 mt-10 md:mt-15">
      {/**Snapshots */}
      <div className="flex flex-col md:flex-row gap-3 ">
        {snapshot.map((s, i) => (
          <div
            key={i}
            className={`relative bg-white/10  p-8 w-full overflow-hidden`}
            style={{
              borderLeft: `2px solid ${s.borderColor}`,
            }}
          >
            <p className="absolute -top-9 -right-9 text-9xl  text-white/10">
              {s.icon}
            </p>
            <p className="text-xs">{s.label}</p>
            <p className="text-5xl font-bold">{s.number.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
