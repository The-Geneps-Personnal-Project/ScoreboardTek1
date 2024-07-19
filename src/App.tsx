import { useEffect, useState } from "react";

import "./App.css";
import "./Theme.css";

import { Header } from "./components/Header/Header";
import { Wrapper } from "./components/Wrapper/Wrapper";
import { Teams } from "./components/Teams/Teams";
import { Background } from "./components/Background/Background";

interface TeamInfo {
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
      const response = await fetch("/database/database.json");
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
          {sortedTeams.map((item, index) => (
            <Teams
              key={item.id}
              name={item.name}
              logo={item.logo}
              score={item.score}
              rank={index + 1}
              maxScore={maxScore}
            />
          ))}
        </Wrapper>
      </Background>
    </>
  );
}

export default App;
