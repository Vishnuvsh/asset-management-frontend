import { useEffect, useState } from "react";
import API from "../api";

const emptyItem = {
  item_name: "",
  quantity: "",
  threshold: "",
};

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [currentItem, setCurrentItem] = useState(emptyItem);

  /* ================= FETCH ================= */
  const fetchItems = () => {
    setLoading(true);
    API.get("inventory/")
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ================= MODAL ================= */
  const openModal = (type, item = emptyItem) => {
    setMode(type);
    setCurrentItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentItem(emptyItem);
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setCurrentItem({
      ...currentItem,
      [e.target.name]: e.target.value,
    });
  };

  const buildPayload = () => ({
    item_name: currentItem.item_name.trim(),
    quantity: Number(currentItem.quantity),
    threshold: Number(currentItem.threshold),
  });

  /* ================= CRUD ================= */
  const createItem = () => {
    API.post("inventory/", buildPayload())
      .then(() => {
        fetchItems();
        closeModal();
      })
      .catch((err) => alert(JSON.stringify(err.response?.data)));
  };

  const updateItem = () => {
    API.put(`inventory/${currentItem.id}/`, buildPayload())
      .then(() => {
        fetchItems();
        closeModal();
      })
      .catch((err) => alert(JSON.stringify(err.response?.data)));
  };

  const deleteItem = (id) => {
    if (!window.confirm("Delete this item?")) return;

    API.delete(`inventory/${id}/`)
      .then(() => fetchItems())
      .catch(() => alert("Delete failed"));
  };

  /* ================= UI ================= */
  return (
    <div className="inventory-page">
      <div className="page-header">
        <h2 className="page-title">Inventory</h2>
        <button className="btn primary" onClick={() => openModal("create")}>
          + Add Item
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="inventory-grid">
          {items.map((i) => {
            const lowStock = i.quantity <= i.threshold;

            return (
              <div key={i.id} className="inventory-card">
                <h3>{i.item_name}</h3>

                <p>Quantity: {i.quantity}</p>
                <p>Threshold: {i.threshold}</p>

                <span className={`stock ${lowStock ? "low" : "ok"}`}>
                  {lowStock ? "LOW STOCK" : "IN STOCK"}
                </span>

                <div className="card-actions">
                  <button onClick={() => openModal("edit", i)}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => deleteItem(i.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============== MODAL ============== */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{mode === "create" ? "Add Item" : "Edit Item"}</h3>

            <input
              name="item_name"
              placeholder="Item name"
              value={currentItem.item_name}
              onChange={handleChange}
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={currentItem.quantity}
              onChange={handleChange}
            />

            <input
              type="number"
              name="threshold"
              placeholder="Threshold"
              value={currentItem.threshold}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>

              {mode === "create" && (
                <button className="primary" onClick={createItem}>
                  Create
                </button>
              )}

              {mode === "edit" && (
                <button className="primary" onClick={updateItem}>
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

export default Inventory;
