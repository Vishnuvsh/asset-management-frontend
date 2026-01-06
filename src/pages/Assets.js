import { useEffect, useState } from "react";
import API from "../api";

const emptyAsset = {
  name: "",
  type: "",
  serial_number: "",
  status: "AVAILABLE",
};

function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // create | view | edit
  const [currentAsset, setCurrentAsset] = useState(emptyAsset);

  // ⚡ User & role logic
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    setIsAdmin(storedUser?.role === "ADMIN");

    fetchAssets();
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
    setCurrentAsset({
      ...currentAsset,
      [e.target.name]: e.target.value,
    });
  };

  // Normalize payload before sending
  const buildPayload = () => ({
    name: currentAsset.name.trim(),
    type: currentAsset.type.trim(),
    serial_number: currentAsset.serial_number.trim(),
    status: currentAsset.status,
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
              <label>Name</label>
              <input
                name="name"
                value={currentAsset.name || ""}
                onChange={handleChange}
                disabled={mode === "view" || !isAdmin}
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <input
                name="type"
                value={currentAsset.type || ""}
                onChange={handleChange}
                disabled={mode === "view" || !isAdmin}
              />
            </div>

            <div className="form-group">
              <label>Serial Number</label>
              <input
                name="serial_number"
                value={currentAsset.serial_number || ""}
                onChange={handleChange}
                disabled={mode === "view" || !isAdmin}
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
