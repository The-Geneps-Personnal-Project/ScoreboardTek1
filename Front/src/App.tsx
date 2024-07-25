import { useEffect, useState } from "react";

import "./App.css";
import "./Theme.css";

import { Header } from "./components/Header/Header";
import { Wrapper } from "./components/Wrapper/Wrapper";
import { Teams } from "./components/Teams/Teams";
import { Background } from "./components/Background/Background";

import Notif from "./assets/Notif.png";

export interface TeamInfo {
  id: number;
  name: string;
  logo: string;
  score: Record<string, number>;
}

interface Team {
  teams: TeamInfo[];
}

function App() {
  const [data, setData] = useState<Team | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/ScoreboardTek1/database/database.json");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching the Teams data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 180000);
    return () => clearInterval(intervalId);
  }, []);

  const getTotalScore = (score: Record<string, number>): number => {
    return Object.values(score).reduce((total, num) => total + num, 0);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const totalScores = data.teams.map((team) => getTotalScore(team.score));
  const maxScore = Math.max(...totalScores);

  const sortedTeams = data.teams
    .slice()
    .sort((a, b) => getTotalScore(b.score) - getTotalScore(a.score));

  return (
    <>
      <Background teamNumber={data.teams.length}>
        <Wrapper>
          <Header />
          <Teams teams={sortedTeams} maxScore={maxScore} />
          <div className="App-footer">tais toi</div>
          <div
            className="App-notif"
            style={{ backgroundImage: `url(${Notif})` }}
          />
        </Wrapper>
      </Background>
    </>
  );
}

export default App;
