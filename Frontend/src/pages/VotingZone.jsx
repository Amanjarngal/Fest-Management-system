import { useEffect } from "react";
import Leaderboard from "../components/Voting comp/Leaderboard";
import Votes from "../components/Voting comp/Votes";
import VotingHero from "../components/Voting comp/VotingHero";
import VotingRules from "../components/Voting comp/VotingRules";

const VotingZone = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // or "auto" if you want instant scroll
    });
  }, []);

  return (
    <>
      <VotingHero />
      <VotingRules />
      <Votes />
    </>
  );
};

export default VotingZone;
