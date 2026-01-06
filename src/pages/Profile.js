import { useEffect, useState } from "react";
import API from "../api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("profile/")
      .then(res => setProfile(res.data))
      .catch(() => alert("Profile load failed"));
  }, []);

  if (!profile) {
  return (
    <div className="profile-loading">
      <div className="loader"></div>
      <p>Loading profile…</p>
    </div>
  );
}

return (
  <div className="profile-container">
    <div className="profile-header">
      <h2>My Profile</h2>
      <p>View your account information</p>
    </div>

    <div className="profile-card">
      <div className="profile-avatar">
        {profile.email.charAt(0).toUpperCase()}
      </div>

      <div className="profile-details">
        <div className="profile-row">
          <span className="label">Email</span>
          <span className="value">{profile.email}</span>
        </div>

        <div className="profile-row">
          <span className="label">Role</span>
          <span className={`role-badge ${profile.role?.toLowerCase()}`}>
            {profile.role}
          </span>
        </div>

        {profile.date_joined && (
          <div className="profile-row">
            <span className="label">Date Joined</span>
            <span className="value">
              {new Date(profile.date_joined).toDateString()}
            </span>
          </div>
        )}

        <div className="profile-row">
          <span className="label">Last Login</span>
          <span className="value">
            {profile.last_login
              ? new Date(profile.last_login).toDateString()
              : "—"}
          </span>
        </div>
      </div>
    </div>
  </div>
);
}

export default Profile;