"use client";
import { useState } from "react";
import { MdOutlinePersonAddAlt } from "react-icons/md";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Roster_Input() {
  const [formInput, setFormInput] = useState({
    name: "",
    score: "",
  });

  const [error, setError] = useState({
    name: "",
    score: "",
  });
  const [loading, setLoading] = useState(false);

  const handleValidation = () => {
    let errors = {
      name: "",
      score: "",
    };
    let valid = true;

    if (formInput.name.trim() === "") {
      errors.name = "Please Input player name";
      valid = false;
    }

    if (formInput.score === "") {
      errors.score = "Please input player score";
      valid = false;
    }

    setError(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleValidation() !== true) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formInput.name,
          score: Number(formInput.score),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error); //will show in UI soon
        return;
      }

      if (data.success) {
        setFormInput({ name: "", score: "" });
      }
    } catch (err: any) {
      console.log("Error uploading data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 mx-5 md:mx-12 lg:mx-0 lg:w-200">
      <div className="font-bold mb-5">
        <p className="text-blue-300">MANAGEMENT</p>
        <h2 className="italic text-3xl">ROSTER INPUT</h2>
      </div>

      <form className="flex flex-col  bg-white/10 p-5" onSubmit={handleSubmit}>
        {/**Name */}
        <label className="block text-sm mb-3">PLAYER ALIAS</label>
        <div className="mb-5 ">
          <input
            type="text"
            name="name"
            value={formInput.name}
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
            className="py-5 px-3 bg-black outline-none ring-0  w-full "
            placeholder="Enter name..."
          />
          {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
        </div>

        {/**Score */}
        <label className="block text-sm mb-3">INITIAL SCORE</label>
        <div className="mb-5 ">
          <input
            type="number"
            name="score"
            value={formInput.score}
            onChange={(e) =>
              setFormInput({ ...formInput, score: e.target.value })
            }
            className="py-5 px-3 bg-black outline-none ring-0 w-full  "
            placeholder="00000"
          />
          {error.score && <p className="text-red-500 text-sm">{error.score}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white cursor-pointer flex gap-2 items-center justify-center p-5 text-sm md:text-base  
             outline-2 outline-dashed outline-blue-600 outline-offset-4
             disabled:opacity-70 disabled:cursor-not-allowed!"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <MdOutlinePersonAddAlt className="text-base md:text-lg mt-1" />
              ADD PLAYER
            </>
          )}
        </button>
      </form>
    </div>
  );
}
