import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
  },
  content: {
    marginLeft: "220px",
    padding: "24px",
    width: "100%",
    background: "#f8fafc",
    minHeight: "100vh",
  },
};

export default Layout;
