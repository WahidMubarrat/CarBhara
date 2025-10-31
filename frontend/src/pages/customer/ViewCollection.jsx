import Navbar from "../../components/Navbar";

const ViewCollection = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", color: "white", background: "#000", minHeight: "100vh" }}>
        <h1>View Collection</h1>
        <p>List of available cars will appear here.</p>
      </div>
    </div>
  );
};

export default ViewCollection;