

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {user.firstname} {user.lastname}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Profile;