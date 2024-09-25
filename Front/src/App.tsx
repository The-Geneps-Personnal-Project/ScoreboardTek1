import { createContext, useEffect, useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import "./Theme.css";

import { Header } from "./components/Header/Header";
import { Wrapper } from "./components/Wrapper/Wrapper";
import { Teams } from "./components/Teams/Teams";
import { Background } from "./components/Background/Background";

// import Notif from "./assets/Notif.png";

import LoginPage from "./pages/LoginPages";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";

export interface TeamInfo {
  id: number;
  name: string;
  logo?: string;
  score: Record<string, number>;
}

const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

function MainPage() {
  const [data, setData] = useState<TeamInfo[] | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/team");
      const data = await response.json();
      console.log("Data fetched: ", data);
      setData(data);
      console.log("Data set: ", data);
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

  const totalScores = data.map((team) => getTotalScore(team.score));
  const maxScore = Math.max(...totalScores);

  const sortedTeams = data
    .slice()
    .sort((a, b) => getTotalScore(b.score) - getTotalScore(a.score));

  return (
    <>
      <Background teamNumber={data.length}>
        <Wrapper>
          <Header />
          <Teams teams={sortedTeams} maxScore={maxScore} />
          <div className="App-footer">tais toi</div>
          {/* <div
            className="App-notif"
            style={{ backgroundImage: `url(${Notif})` }}
          /> */}
        </Wrapper>
      </Background>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export { AuthContext };
export default App;
