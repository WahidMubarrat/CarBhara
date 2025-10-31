import Navbar from "../../components/Navbar";

const Profile = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", color: "white", background: "#000", minHeight: "100vh" }}>
        <h1>Profile Page</h1>
        <p>This is your profile section.</p>
      </div>
    </div>
  );
};

export default Profile;