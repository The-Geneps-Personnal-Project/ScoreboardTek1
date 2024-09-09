import React, { useEffect, useState } from "react";
import { TeamInfo } from "../App";

import "./styles/AdminPanel.css";

const AdminPanel = () => {
  const [data, setData] = useState<TeamInfo[] | null>(null);
  const [editTeamId, setEditTeamId] = useState<number | null>(null);
  const [editedTeam, setEditedTeam] = useState<Partial<TeamInfo> | null>(null);
  const [temporaryScores, setTemporaryScores] = useState<
    Record<string, { key: string; value: number }>
  >({});
  const [isAddingNewTeam, setIsAddingNewTeam] = useState(false); // New state to toggle new team form
  const [newTeam, setNewTeam] = useState<Partial<TeamInfo>>({
    name: "",
    logo: "",
    score: {},
  }); // State for new team

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/team");
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

  const handleEdit = (team: TeamInfo) => {
    setEditTeamId(team.id);
    setEditedTeam(team);
    setTemporaryScores(
      Object.fromEntries(
        Object.entries(team.score || {}).map(([key, value]) => [
          key,
          { key, value },
        ])
      )
    );
  };

  const handleSave = async () => {
    try {
      const updatedScores = Object.fromEntries(
        Object.entries(temporaryScores).map(([_, { key, value }]) => [
          key,
          value,
        ])
      );

      await fetch(`http://localhost:8080/team/${editTeamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          password: process.env.REACT_APP_REQUEST_PASSWORD || "",
        },
        body: JSON.stringify({ ...editedTeam, score: updatedScores }),
      });

      if (data && editedTeam) {
        setData(
          data.map((team) =>
            team.id === editTeamId
              ? { ...team, ...editedTeam, score: updatedScores }
              : team
          ) as TeamInfo[]
        );
      }

      setEditTeamId(null);
      setEditedTeam(null);
      setTemporaryScores({});
    } catch (error) {
      console.error("Error saving the team data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/team/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          password: process.env.REACT_APP_REQUEST_PASSWORD || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the team");
      }

      setData((prevData) => prevData?.filter((team) => team.id !== id) || null);
      console.log("Team deleted successfully");
    } catch (error) {
      console.error("Error deleting the team:", error);
      alert("An error occurred while trying to delete the team.");
    }
  };

  const handleScoreChange = (
    key: string,
    field: "key" | "value",
    value: string | number
  ) => {
    setTemporaryScores((prevScores) => ({
      ...prevScores,
      [key]: {
        ...prevScores[key],
        [field]: field === "value" ? Number(value) : value,
      },
    }));
  };

  const handleAddScore = () => {
    const newKey = `New Score ${Date.now()}`;
    setTemporaryScores((prevScores) => ({
      ...prevScores,
      [newKey]: { key: newKey, value: 0 },
    }));
  };

  const handleRemoveScore = (key: string) => {
    const { [key]: _, ...newScores } = temporaryScores;
    setTemporaryScores(newScores);
  };

  const handleCreateTeam = async () => {
    try {
      // Send a POST request to create a new team
      const response = await fetch("http://localhost:8080/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          password: process.env.REACT_APP_REQUEST_PASSWORD || "",
        },
        body: JSON.stringify(newTeam),
      });

      if (!response.ok) {
        throw new Error("Failed to create the new team");
      }

      // Fetch updated data to include the new team
      await fetchData();

      // Reset the new team form and close it
      setNewTeam({ name: "", logo: "", score: {} });
      setIsAddingNewTeam(false);
    } catch (error) {
      console.error("Error creating the new team:", error);
      alert("An error occurred while trying to create the new team.");
    }
  };

  return (
    <div className="AdminPanel">
      <h1>Admin Panel</h1>
      <h2>Teams</h2>
      <button
        style={{ height: "6vh", width: "20vw" }}
        onClick={() => setIsAddingNewTeam(!isAddingNewTeam)}
      >
        {isAddingNewTeam ? "Cancel Adding Team" : "Add New Team"}
      </button>

      {isAddingNewTeam && (
        <div className="NewTeamForm">
          <input
            type="text"
            value={newTeam.name || ""}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            placeholder="Team Name"
          />
          <input
            type="text"
            value={newTeam.logo || ""}
            onChange={(e) => setNewTeam({ ...newTeam, logo: e.target.value })}
            placeholder="Team Logo URL"
          />
          <button
            onClick={handleCreateTeam}
            style={{ backgroundColor: "blue", width: "10vw" }}
          >
            Create Team
          </button>
        </div>
      )}

      <ul className="AdminPanelTeams">
        {data?.map((team) => (
          <li key={team.id} className="AdminPanelTeam">
            {editTeamId === team.id ? (
              <div className="AdminEdit">
                <input
                  type="text"
                  value={editedTeam?.name || ""}
                  onChange={(e) =>
                    setEditedTeam({ ...editedTeam, name: e.target.value })
                  }
                  placeholder="Team Name"
                />
                <input
                  type="text"
                  value={editedTeam?.logo || ""}
                  onChange={(e) =>
                    setEditedTeam({ ...editedTeam, logo: e.target.value })
                  }
                  placeholder="Team Logo URL"
                />
                {Object.entries(temporaryScores).map(
                  ([originalKey, { key, value }]) => (
                    <div key={originalKey} className="ScoreEdit">
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <input
                          type="text"
                          value={key}
                          onChange={(e) =>
                            handleScoreChange(
                              originalKey,
                              "key",
                              e.target.value
                            )
                          }
                          placeholder="Score Name"
                        />
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            handleScoreChange(
                              originalKey,
                              "value",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Score Value"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveScore(originalKey)}
                        className="ScoreRemove"
                        style={{ backgroundColor: "red" }}
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
                <button onClick={handleAddScore}>Add Score</button>
                <button
                  onClick={handleSave}
                  style={{ backgroundColor: "green" }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditTeamId(null)}
                  style={{ backgroundColor: "rebeccapurple" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="AdminPanelTeam">
                <h2>{team.name}</h2>
                {team.logo && <img src={team.logo} alt={team.name} />}
                <div className="AdminPanelScores">
                  {Object.entries(team.score).map(([key, value]) => (
                    <span key={key}>
                      {key}: {value}
                    </span>
                  ))}
                </div>
                <button onClick={() => handleEdit(team)}>Edit</button>
                <button onClick={() => handleDelete(team.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
