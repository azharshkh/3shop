import { useState, useEffect } from "react";
import "./HomePage.css";

const branchNames = {
  1: "Salar Nagar",
  2: "Malik Nagar",
  3: "Aqsa Nagar"
};

const credentials = {
  "salar nagar": 1,
  "malik nagar": 2,
  "aqsa nagar": 3
};

function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [branchNumber, setBranchNumber] = useState(null);
  const [viewBranch, setViewBranch] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [entries, setEntries] = useState([
    {
      item: "Cement",
      unit: "bags",
      quantities: { 1: 100, 2: 60, 3: 50 },
      requests: {
        1: { 2: { qty: 0, status: "--" }, 3: { qty: 0, status: "--" } },
        2: { 1: { qty: 0, status: "--" }, 3: { qty: 0, status: "--" } },
        3: { 1: { qty: 0, status: "--" }, 2: { qty: 0, status: "--" } }
      }
    }
  ]);

  useEffect(() => {
    const stored = localStorage.getItem("rememberedBranch");
    if (stored && credentials[stored]) {
      const bn = credentials[stored];
      setBranchNumber(bn);
      setViewBranch([1, 2, 3].find((b) => b !== bn));
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    const lowerUser = username.trim().toLowerCase();
    const lowerPass = password.trim().toLowerCase();

    if (credentials[lowerUser] && lowerUser === lowerPass) {
      const bn = credentials[lowerUser];
      setBranchNumber(bn);
      setViewBranch([1, 2, 3].find((b) => b !== bn));
      setLoggedIn(true);

      if (rememberMe) {
        localStorage.setItem("rememberedBranch", lowerUser);
      }
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rememberedBranch");
    setLoggedIn(false);
    setBranchNumber(null);
    setUsername("");
    setPassword("");
    setRememberMe(false);
  };

  const toggleViewBranch = () => {
    const others = [1, 2, 3].filter((b) => b !== branchNumber);
    const next = others.find((b) => b !== viewBranch) || others[0];
    setViewBranch(next);
  };

  const updateOwnField = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const updateOwnQuantity = (index, value) => {
    const updated = [...entries];
    updated[index].quantities[branchNumber] = Number(value);
    setEntries(updated);
  };

  const updateRequest = (index, toBranch) => {
    const updated = [...entries];
    const request = updated[index].requests[branchNumber][toBranch];
    if (request.qty > 0) {
      request.status = "Requested";
    }
    setEntries(updated);
  };

  const handleApproval = (index, fromBranch, approved) => {
    const updated = [...entries];
    const req = updated[index].requests[fromBranch][branchNumber];
    const qty = req.qty;

    if (approved && qty <= updated[index].quantities[branchNumber]) {
      updated[index].quantities[branchNumber] -= qty;
      updated[index].quantities[fromBranch] += qty;
      req.status = "Approved";
    } else {
      req.qty = 0;
      req.status = "Rejected";
    }
    setEntries(updated);
  };

  const handleUpdateAll = () => {
    console.log("Updating inventory for branch", branchNumber);
    console.log(entries);
  };

  const addRow = () => {
    const empty = {
      item: "",
      unit: "",
      quantities: { 1: 0, 2: 0, 3: 0 },
      requests: {
        1: { 2: { qty: 0, status: "--" }, 3: { qty: 0, status: "--" } },
        2: { 1: { qty: 0, status: "--" }, 3: { qty: 0, status: "--" } },
        3: { 1: { qty: 0, status: "--" }, 2: { qty: 0, status: "--" } }
      }
    };
    setEntries([...entries, empty]);
  };

  if (!loggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <h2>Branch Login</h2>

          <select
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          >
            <option value="">-- Select Branch --</option>
            <option value="salar nagar">Salar Nagar</option>
            <option value="malik nagar">Malik Nagar</option>
            <option value="aqsa nagar">Aqsa Nagar</option>
          </select>

          <input
            type="password"
            placeholder="Password (same as branch name)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="remember-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="container">
        <h1>Branch: {branchNames[branchNumber]}</h1>

        <div className="top-buttons">
          <button onClick={handleLogout}>Logout</button>
          <button onClick={toggleViewBranch}>Show {branchNames[viewBranch]}</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty ({branchNames[branchNumber]})</th>
                <th>Unit</th>
                <th>Qty ({branchNames[viewBranch]})</th>
                <th>Request → {branchNames[viewBranch]}</th>
                <th>Status → {branchNames[viewBranch]}</th>
                <th>From {branchNames[viewBranch]}</th>
                <th>Approve/Reject</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={entry.item}
                      onChange={(e) => updateOwnField(index, "item", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={entry.quantities[branchNumber]}
                      onChange={(e) => updateOwnQuantity(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={entry.unit}
                      onChange={(e) => updateOwnField(index, "unit", e.target.value)}
                    />
                  </td>
                  <td>{entry.quantities[viewBranch]}</td>
                  <td>
                    <input
                      type="number"
                      value={entry.requests[branchNumber][viewBranch].qty}
                      onChange={(e) => {
                        const val = [...entries];
                        val[index].requests[branchNumber][viewBranch].qty = Number(e.target.value);
                        setEntries(val);
                      }}
                    />
                    <button onClick={() => updateRequest(index, viewBranch)}>Send</button>
                  </td>
                  <td>
                    <span className={`status ${entry.requests[branchNumber][viewBranch].status.toLowerCase()}`}>
                      {entry.requests[branchNumber][viewBranch].status}
                    </span>
                  </td>
                  <td>{entry.requests[viewBranch][branchNumber].qty}</td>
                  <td>
                    {entry.requests[viewBranch][branchNumber].status === "Requested" ? (
                      <>
                        <button onClick={() => handleApproval(index, viewBranch, true)}>✔</button>
                        <button onClick={() => handleApproval(index, viewBranch, false)}>✖</button>
                      </>
                    ) : (
                      <span className={`status ${entry.requests[viewBranch][branchNumber].status.toLowerCase()}`}>
                        {entry.requests[viewBranch][branchNumber].status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="button-group">
          <button onClick={addRow}>Add Item</button>
          <button onClick={handleUpdateAll}>Update Inventory</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
