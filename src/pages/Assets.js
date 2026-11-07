import { useEffect, useState } from "react";
import API from "../api";

const emptyAsset = {
  name: "",
  type: "",
  serial_number: "",
  status: "AVAILABLE",
  inventory_item: "",
};

function Assets() {
  const [assets, setAssets] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // create | view | edit
  const [currentAsset, setCurrentAsset] = useState(emptyAsset);

  // ⚡ User & role logic
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setIsAdmin(storedUser?.role === "ADMIN");

    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch assets
const fetchAssets = () => {
  setLoading(true);

  // Admin → all assets
  if (isAdmin) {
    API.get("assets/")
      .then((res) => setAssets(res.data))
      .finally(() => setLoading(false));
  } 
  // Employee → only assigned assets
  else {
    API.get("assets/assigned/") // 🔥 employee assigned assets only
      .then((res) => setAssets(res.data))
      .finally(() => setLoading(false));
  }
};


  // Open modal
  const openModal = (type, asset = emptyAsset) => {
    // Employees cannot open create/edit modal
    if (!isAdmin && (type === "create" || type === "edit")) return;

    if (isAdmin && (type === "create" || type === "edit")) {
      API.get("inventory/")
        .then((res) => setInventoryItems(res.data))
        .catch((err) => console.error("Error fetching inventory:", err));
    }

    setMode(type);
    setCurrentAsset(asset);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentAsset(emptyAsset);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "inventory_item") {
      const selected = inventoryItems.find((i) => i.id === Number(value));
      if (selected) {
        setCurrentAsset((prev) => ({
          ...prev,
          inventory_item: value,
          name: selected.item_name,
          type: selected.item_name,
        }));
        return;
      }
    }

    setCurrentAsset((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Normalize payload before sending
  const buildPayload = () => ({
    name: currentAsset.name.trim(),
    type: currentAsset.type.trim(),
    serial_number: currentAsset.serial_number.trim(),
    status: currentAsset.status,
    inventory_item: currentAsset.inventory_item ? Number(currentAsset.inventory_item) : null,
  });

  // Create asset
  const createAsset = () => {
    if (!isAdmin) return; // Employee cannot create
    API.post("assets/", buildPayload())
      .then(() => {
        fetchAssets();
        closeModal();
      })
      .catch((err) => {
        console.error("CREATE ERROR:", err.response?.data);
        alert(JSON.stringify(err.response?.data, null, 2));
      });
  };

  // Update asset
  const updateAsset = () => {
    if (!isAdmin) return; // Employee cannot update
    API.put(`assets/${currentAsset.id}/`, buildPayload())
      .then(() => {
        fetchAssets();
        closeModal();
      })
      .catch((err) => {
        console.error("UPDATE ERROR:", err.response?.data);
        alert("Asset update ചെയ്യാൻ പറ്റിയില്ല. Details console-ൽ നോക്കുക.");
      });
  };

  // Delete asset
  const deleteAsset = (id) => {
    if (!isAdmin) return; // Employee cannot delete
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    API.delete(`assets/${id}/`)
      .then(() => fetchAssets())
      .catch((err) => console.error(err));
  };

  return (
    <div className="assets-page">
      <div className="page-header">
        <h2 className="page-title">Assets</h2>

        {/* +Add Asset → Admin only */}
        {isAdmin && (
          <button className="btn primary" onClick={() => openModal("create")}>
            + Add Asset
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading assets...</p>
      ) : (
        <div className="assets-grid">
          {assets.map((a) => (
            <div key={a.id} className="asset-card">
              <h3>{a.name}</h3>
              <p className="type">{a.type}</p>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0" }}>
                SN: <strong style={{ color: "#1e293b" }}>{a.serial_number}</strong>
              </p>
              {a.assigned_to && (
                <p style={{ fontSize: "12px", color: "#2563eb", margin: "2px 0 6px", fontWeight: "500" }}>
                  👤 {a.assigned_to}
                </p>
              )}
              <span className={`status ${a.status}`}>
                {a.status.toUpperCase()}
              </span>

              <div className="card-actions">
                {/* View → Everyone */}
                <button onClick={() => openModal("view", a)}>View</button>

                {/* Edit/Delete → Admin only */}
                {isAdmin && (
                  <>
                    <button onClick={() => openModal("edit", a)}>Edit</button>
                    <button
                      className="danger"
                      onClick={() => deleteAsset(a.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>
              {mode === "create" && "Create Asset"}
              {mode === "view" && "Asset Details"}
              {mode === "edit" && "Edit Asset"}
            </h3>

            <div className="form-group">
              <label>Inventory Source (Stock auto-decreases)</label>
              <select
                name="inventory_item"
                value={currentAsset.inventory_item || ""}
                onChange={handleChange}
                disabled={mode === "view" || !isAdmin}
              >
                <option value="">-- None / Custom Asset --</option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.item_name} (Stock: {item.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={currentAsset.name || ""}
                onChange={handleChange}
                disabled={mode === "view" || !isAdmin}
                placeholder="e.g. Mouse Dell MS116"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <input
                name="type"
                value={currentAsset.type || ""}
                onChange={handleChange}
                disabled={mode === "view" || !isAdmin}
                placeholder="e.g. Mouse"
              />
            </div>

            <div className="form-group">
              <label>Serial Number</label>
              <input
                name="serial_number"
                value={currentAsset.serial_number || ""}
                onChange={handleChange}
                disabled={mode === "view" || !isAdmin}
                placeholder="e.g. SN-987654"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={currentAsset.status || "AVAILABLE"}
                onChange={handleChange}
                disabled={mode === "view" || !isAdmin}
              >
                <option value="AVAILABLE">Available</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>

              {mode === "create" && isAdmin && (
                <button className="primary" onClick={createAsset}>
                  Create
                </button>
              )}

              {mode === "edit" && isAdmin && (
                <button className="primary" onClick={updateAsset}>
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assets;
