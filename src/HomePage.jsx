import { useState } from "react";

function HomePage() {
  const [branchNumber, setBranchNumber] = useState(1);

  const nextBranch = () => {
    setBranchNumber((prev) => (prev === 3 ? 1 : prev + 1));
  };

  const [entries, setEntries] = useState([
    { item: "", quantity: "", unit: "" }
  ]);

  const addRow = () => {
    setEntries([...entries, { item: "", quantity: "", unit: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  return (
    <div>
      <h1>3 SHOP</h1>
      <button onClick={nextBranch}>Branch {branchNumber}</button>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit</th>

            <th>Quantity in shop 2</th>
            <th>Request shop 2</th>
            <th>Approval shop 2</th>

            <th>Quantity in shop 3</th>
            <th>Request shop 3</th>
            <th>Approval shop 3</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={entry.item}
                  onChange={(e) => handleChange(index, "item", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={entry.quantity}
                  onChange={(e) => handleChange(index, "quantity", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={entry.unit}
                  onChange={(e) => handleChange(index, "unit", e.target.value)}
                />
              </td>

              <td>--</td>
              <td>
                <input type="number" disabled />
                <button disabled>Send</button>
              </td>
              <td>--</td>

              <td>--</td>
              <td>
                <input type="number" disabled />
                <button disabled>Send</button>
              </td>
              <td>--</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow}>Add Item</button>
    </div>
  );
}

export default HomePage;
