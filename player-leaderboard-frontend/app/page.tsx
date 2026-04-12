import Snapshot from "./Snapshot";
import Nav from "./Nav";
import Input from "./Roster_Input";
import Leaderboard from "./Leaderboard";

export default function Home() {
  return (
    <div className="bg-black overflow-hidden  mb-25 md:mb-2">
      <Nav />
      <Snapshot />
      <div className="lg:flex lg:gap-5   lg:px-12  lg:w-full ">
        <Input />
        <Leaderboard />
      </div>
    </div>
  );
}
