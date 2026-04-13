"use client";
import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import toast from "react-hot-toast";

type Player = {
  id: number;
  name: string;
  score: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    score: "" as string | number,
  });
  const [error, setError] = useState({
    name: "",
    score: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/players`);
        const data = await res.json();
        if (data.success && data.players) {
          setLeaderboard(data.players);
        }
      } catch (err) {
        toast.error("Failed to fetch players information.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const validateFields = () => {
    let errors = {
      name: "",
      score: "",
    };
    let valid = true;

    if (editForm.name.trim() === "") {
      errors.name = "Please Input player name";
      valid = false;
    }

    if (Number(editForm.score) <= 0 || editForm.score === "") {
      errors.score = "Please input player score";
      valid = false;
    }

    setError(errors);
    return valid;
  };

  //For Edit
  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    const updatedItem = leaderboard.map((lead) => {
      if (lead.id === id) {
        return {
          ...lead,
          name: editForm.name,
          score: Number(editForm.score),
        };
      }
      return lead;
    });

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/players/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editForm.name,
          score: Number(editForm.score),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.error || "Something went wrong while updating this item.",
        );
      } else {
        toast.success(data.message || "Item updated sucessfully.");
        setLeaderboard(updatedItem);
        setEditingId(null);
      }
    } catch (err: any) {
      toast.error("Unable to update this item, Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"`,
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/players/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete Player record.");
      } else {
        const deletePlayer = leaderboard.filter((t) => t.id !== id);
        setLeaderboard(deletePlayer);
        toast.success(`"${name}" has been deleted successfully`);
      }
    } catch (err) {
      toast.error("Error deleting records, Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 mx-5 md:mx-12 lg:mx-0 lg:w-full">
      <div className="font-bold mb-5">
        <h4 className="text-cyan-400 ">LIVE RANKING </h4>
        <h2 className="italic text-3xl">GLOBAL LEADERBOARD</h2>
      </div>

      {/**Fetch,edit and delete */}
      <div className=" lg:max-h-[70vh] lg:overflow-y-auto pr-2 hide-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex justify-center items-center text-center h-40 text-gray-400 text-sm italic">
            There are currently no players on the leaderboard. Add one to get
            started.
          </div>
        ) : (
          [...leaderboard]
            .sort((a, b) => b.score - a.score)
            .map((lead, index) => (
              <div
                key={lead.id}
                className="flex justify-between bg-white/10 p-3 text-sm border-l border-l-cyan-300 mb-2 overflow-hidden"
              >
                {/**name */}
                <div className="flex items-center gap-5 md:gap-10">
                  <h2 className="text-3xl text-cyan-500/60 italic font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </h2>

                  {editingId === lead.id ? (
                    <div>
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className=" rounded-xl w-20 text-center p-1 bg-black outline-none"
                      />
                      {error.name && (
                        <p className="text-red-500 text-[10px] mx-1">
                          {error.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p>{lead.name || "John Doe"} </p>
                  )}
                </div>

                {/**score,edit,delete */}
                <div className="flex items-center gap-5">
                  {editingId === lead.id ? (
                    <div>
                      <input
                        type="number"
                        value={editForm.score}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            score: e.target.value,
                          }))
                        }
                        className="rounded-xl w-10 md:w-20 text-center p-1 bg-black outline-none"
                      />
                      {error.score && (
                        <p className="text-red-500 text-[10px] mx-1">
                          {error.score}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="flex flex-col">
                      {lead.score ?? 0}{" "}
                      <span className="text-[11px]">POINTS</span>{" "}
                    </p>
                  )}

                  {editingId === lead.id ? (
                    <>
                      {/**Send */}
                      <button
                        onClick={(e) => handleClick(e, lead.id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                        ) : (
                          <IoSend />
                        )}
                      </button>

                      {/**Cancel */}
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setError({ name: "", score: "" });
                        }}
                      >
                        X
                      </button>
                    </>
                  ) : (
                    <>
                      {/**Edit */}
                      <button
                        onClick={() => {
                          setEditingId(lead.id);
                          setEditForm({
                            name: lead.name,
                            score: lead.score,
                          });
                        }}
                      >
                        <CiEdit />
                      </button>

                      {/**Delete */}
                      <button
                        onClick={() => handleDelete(lead.id, lead.name)}
                        className="text-red-400"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
