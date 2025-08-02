import { useState } from "react";

const branchNames = {
  1: "Salar Nagar",
  2: "Malik Nagar",
  3: "Aqsa Nagar"
};

function HomePage() {
  const [branchNumber, setBranchNumber] = useState(1); // Simulate login

  const otherBranches = [1, 2, 3].filter((b) => b !== branchNumber);

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
      req.status = "--";
    }
    setEntries(updated);
  };

  const handleUpdateAll = () => {
    console.log("Updating inventory for branch", branchNumber);
    console.log(entries);
    // TODO: Push to Firebase here
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

  return (
    <div>
      <h1>3 SHOP - {branchNames[branchNumber]}</h1>
      <button onClick={() => setBranchNumber((prev) => (prev % 3) + 1)}>
        Switch to {branchNames[(branchNumber % 3) + 1]}
      </button>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty ({branchNames[branchNumber]})</th>
            <th>Unit</th>

            {otherBranches.map((b) => (
              <th key={`qty-${b}`}>Qty ({branchNames[b]})</th>
            ))}

            {otherBranches.map((b) => (
              <th key={`req-${b}`}>Request → {branchNames[b]}</th>
            ))}

            {otherBranches.map((b) => (
              <th key={`status-${b}`}>Status → {branchNames[b]}</th>
            ))}

            {otherBranches.map((b) => (
              <th key={`from-${b}`}>From {branchNames[b]}</th>
            ))}

            {otherBranches.map((b) => (
              <th key={`fromstat-${b}`}>Approve/Reject</th>
            ))}
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

              {otherBranches.map((b) => (
                <td key={`qty-${b}`}>{entry.quantities[b]}</td>
              ))}

              {otherBranches.map((b) => (
                <td key={`rq-${b}`}>
                  <input
                    type="number"
                    value={entry.requests[branchNumber][b].qty}
                    onChange={(e) => {
                      const val = [...entries];
                      val[index].requests[branchNumber][b].qty = Number(e.target.value);
                      setEntries(val);
                    }}
                  />
                  <button onClick={() => updateRequest(index, b)}>Send</button>
                </td>
              ))}

              {otherBranches.map((b) => (
                <td key={`stat-${b}`}>
                  {entry.requests[branchNumber][b].status}
                </td>
              ))}

              {otherBranches.map((b) => (
                <td key={`from-${b}`}>{entry.requests[b][branchNumber].qty}</td>
              ))}

              {otherBranches.map((b) => (
                <td key={`frombtn-${b}`}>
                  {entry.requests[b][branchNumber].status === "Requested" ? (
                    <>
                      <button onClick={() => handleApproval(index, b, true)}>✔</button>
                      <button onClick={() => handleApproval(index, b, false)}>✖</button>
                    </>
                  ) : (
                    entry.requests[b][branchNumber].status
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={addRow}>Add Item</button>
      <button onClick={handleUpdateAll}>Update Inventory</button>
    </div>
  );
}

export default HomePage;
