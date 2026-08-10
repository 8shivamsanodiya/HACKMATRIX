import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function VolunteerDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [volunteers, setVolunteers] = useState([]);
  const [activeVolunteerId, setActiveVolunteerId] = useState("");
  const [volunteerLoading, setVolunteerLoading] = useState(false);
  const [volunteerSummary, setVolunteerSummary] = useState({ total: 0, available: 0, busy: 0, unavailable: 0 });
  const [donations, setDonations] = useState([]);
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationSummary, setDonationSummary] = useState({ total_donations: 0, total_meals_donated: 0, available_meals: 0, claimed_meals: 0 });

  useEffect(() => {
    fetchVolunteers();
    fetchVolunteerSummary();
    fetchDonations();
    fetchDonationSummary();
  }, []);

  const fetchVolunteers = async () => {
    setVolunteerLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/volunteers`);
      if (!response.ok) throw new Error("Could not fetch volunteers");
      const data = await response.json();
      setVolunteers(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && !activeVolunteerId) {
        setActiveVolunteerId(data[0].id.toString());
      }
    } catch (error) {
      console.error("Volunteer fetch error:", error);
      setVolunteers([]);
    } finally {
      setVolunteerLoading(false);
    }
  };

  const fetchVolunteerSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/api/volunteers/summary`);
      if (!response.ok) throw new Error("Could not fetch volunteer summary");
      const data = await response.json();
      setVolunteerSummary(data);
    } catch (error) {
      console.error("Volunteer summary error:", error);
    }
  };

  const fetchDonations = async () => {
    setDonationLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/donations`);
      if (!response.ok) throw new Error("Could not fetch donations");
      const data = await response.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Donation error:", error);
      setDonations([]);
    } finally {
      setDonationLoading(false);
    }
  };

  const fetchDonationSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/api/donations/summary`);
      if (!response.ok) throw new Error("Could not fetch donation summary");
      const data = await response.json();
      setDonationSummary({
        total_donations: data.total_donations ?? 0,
        total_meals_donated: data.total_meals_donated ?? 0,
        available_meals: data.available_meals ?? 0,
        claimed_meals: data.claimed_meals ?? 0,
      });
    } catch (error) {
      console.error("Donation summary error:", error);
    }
  };

  const updateVolunteerAvailability = async (availability) => {
    if (!activeVolunteerId) {
      alert("Please select or register a volunteer profile first.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/volunteers/${activeVolunteerId}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update availability");
      
      alert(`Status updated to ${availability}`);
      fetchVolunteers();
      fetchVolunteerSummary();
    } catch (error) {
      console.error("Availability update error:", error);
      alert(error.message);
    }
  };

  const updateDonationStatus = async (donationId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/donations/${donationId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update donation");
      
      fetchDonations();
      fetchDonationSummary();
    } catch (error) {
      console.error("Donation status error:", error);
      alert(error.message);
    }
  };

  const activeVolunteer = volunteers.find((v) => v.id.toString() === activeVolunteerId);
  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Available Pickups", icon: "🚴" },
    { name: "My Claims & History", icon: "📦" },
  ];

  const renderDashboard = () => {
    const availablePickups = donations.filter((d) => d.status === "Available");
    const claimedPickups = donations.filter((d) => d.status === "Claimed");

    return (
      <div className="prediction-page">
        <div className="prediction-heading">
          <div>
            <p className="dashboard-label">VOLUNTEER HUB</p>
            <h1>Redistribute surplus food efficiently.</h1>
            <p>Simulate availability, coordinate logistics, and make sure fresh meals reach their destination.</p>
          </div>
        </div>

        <section className="panel" style={{ marginBottom: "30px" }}>
          <div className="panel-header">
            <div>
              <p className="dashboard-label">VOLUNTEER SIMULATOR</p>
              <h2>Select Active Profile</h2>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "bold" }}>Active Volunteer Account</label>
              <select
                value={activeVolunteerId}
                onChange={(e) => setActiveVolunteerId(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #dce8df" }}
              >
                {volunteerLoading ? (
                  <option>Loading profiles...</option>
                ) : volunteers.length === 0 ? (
                  <option value="">No volunteers registered</option>
                ) : (
                  volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.role || "Volunteer"}) - {v.availability}
                    </option>
                  ))
                )}
              </select>
            </div>

            {activeVolunteer && (
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "bold" }}>Quick Status Update</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className={`secondary-button ${activeVolunteer.availability === "Available" ? "active" : ""}`}
                    onClick={() => updateVolunteerAvailability("Available")}
                    style={{ flex: 1, background: activeVolunteer.availability === "Available" ? "#1b9b5d" : "", color: activeVolunteer.availability === "Available" ? "#fff" : "", padding: "10px" }}
                  >
                    🟢 Available
                  </button>
                  <button
                    className={`secondary-button ${activeVolunteer.availability === "Busy" ? "active" : ""}`}
                    onClick={() => updateVolunteerAvailability("Busy")}
                    style={{ flex: 1, background: activeVolunteer.availability === "Busy" ? "#e0932c" : "", color: activeVolunteer.availability === "Busy" ? "#fff" : "", padding: "10px" }}
                  >
                    🟡 Busy
                  </button>
                  <button
                    className={`secondary-button ${activeVolunteer.availability === "Unavailable" ? "active" : ""}`}
                    onClick={() => updateVolunteerAvailability("Unavailable")}
                    style={{ flex: 1, background: activeVolunteer.availability === "Unavailable" ? "#dc635b" : "", color: activeVolunteer.availability === "Unavailable" ? "#fff" : "", padding: "10px" }}
                  >
                    🔴 Off
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="stat-grid">
          <div className="stat-card"><p>Active Pickups Pending</p><strong>{availablePickups.length}</strong></div>
          <div className="stat-card"><p>Currently Claimed/In Transit</p><strong>{claimedPickups.length}</strong></div>
          <div className="stat-card"><p>Total RESCUED Meals</p><strong>{donationSummary.total_meals_donated}</strong></div>
          <div className="stat-card"><p>Active Rescuers</p><strong>{volunteerSummary.available}</strong></div>
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="dashboard-label">URGENT</p>
                <h2>Ready for Pickup</h2>
              </div>
              <button className="small-button" onClick={fetchDonations}>↻</button>
            </div>
            <div className="historical-table" style={{ marginTop: "15px" }}>
              <div className="table-row table-header">
                <span>Date</span><span>Meals</span><span>Location/Desc</span><span>Action</span>
              </div>
              {availablePickups.slice(0, 5).map((d) => (
                <div className="table-row" key={d.id}>
                  <span>{d.donation_date}</span>
                  <strong>{d.meals}</strong>
                  <span>{d.description || "Surplus Kitchen Food"}</span>
                  <button
                    className="primary-button"
                    style={{ padding: "6px 12px", fontSize: "11px" }}
                    onClick={() => updateDonationStatus(d.id, "Claimed")}
                  >
                    Claim 🚴
                  </button>
                </div>
              ))}
              {availablePickups.length === 0 && (
                <div style={{ padding: "20px", textAlign: "center", color: "#789087" }}>
                  All quiet! No pending donations available right now.
                </div>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="dashboard-label">LOGISTICS</p>
                <h2>Current Shipments</h2>
              </div>
            </div>
            <div className="historical-table" style={{ marginTop: "15px" }}>
              <div className="table-row table-header">
                <span>Meals</span><span>Status</span><span>Action</span>
              </div>
              {claimedPickups.map((d) => (
                <div className="table-row" key={d.id}>
                  <strong>{d.meals} meals</strong>
                  <span style={{ color: "#e0932c", fontWeight: "bold" }}>Claimed (In Transit)</span>
                  <button
                    className="primary-button"
                    style={{ padding: "6px 12px", fontSize: "11px", background: "#1b9b5d" }}
                    onClick={() => updateDonationStatus(d.id, "Collected")}
                  >
                    Mark Delivered ✓
                  </button>
                </div>
              ))}
              {claimedPickups.length === 0 && (
                <div style={{ padding: "20px", textAlign: "center", color: "#789087" }}>
                  No shipments currently claimed.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderAvailablePickups = () => {
    const availablePickups = donations.filter((d) => d.status === "Available");
    return (
      <div className="prediction-page">
        <div className="prediction-heading">
          <div>
            <p className="dashboard-label">COORDINATION</p>
            <h1>Available Pickups</h1>
            <p>Claim available food packages prepared by the kitchens and redirect them to partner NGOs.</p>
          </div>
          <button className="small-button" onClick={fetchDonations}>↻ Refresh List</button>
        </div>

        <section className="historical-section">
          <div className="historical-table">
            <div className="table-row table-header">
              <span>Date</span><span>Meals Count</span><span>Description</span><span>Status</span><span>Action</span>
            </div>
            {donationLoading ? (
              <div className="table-row"><span>Loading available pickups...</span></div>
            ) : availablePickups.length === 0 ? (
              <div className="table-row"><span>No available food collections found. Check back soon!</span></div>
            ) : (
              availablePickups.map((donation) => (
                <div className="table-row" key={donation.id}>
                  <span>{donation.donation_date}</span>
                  <strong>{donation.meals}</strong>
                  <span>{donation.description || "Kitchen Surplus"}</span>
                  <span style={{ color: "#1b9b5d", fontWeight: "bold" }}>{donation.status}</span>
                  <button
                    className="primary-button"
                    style={{ padding: "8px 16px" }}
                    onClick={() => updateDonationStatus(donation.id, "Claimed")}
                  >
                    Claim Pickup 🚴
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  };

  const renderClaimsHistory = () => {
    const myClaims = donations.filter((d) => d.status === "Claimed" || d.status === "Collected");
    return (
      <div className="prediction-page">
        <div className="prediction-heading">
          <div>
            <p className="dashboard-label">TRACKING</p>
            <h1>Your Delivery History</h1>
            <p>Manage all your claimed collections and see completed food distributions.</p>
          </div>
          <button className="small-button" onClick={fetchDonations}>↻ Refresh History</button>
        </div>

        <section className="historical-section">
          <div className="historical-table">
            <div className="table-row table-header">
              <span>Date</span><span>Meals Count</span><span>Description</span><span>Status</span><span>Action</span>
            </div>
            {donationLoading ? (
              <div className="table-row"><span>Loading your claims...</span></div>
            ) : myClaims.length === 0 ? (
              <div className="table-row"><span>You have not claimed any deliveries yet.</span></div>
            ) : (
              myClaims.map((donation) => (
                <div className="table-row" key={donation.id}>
                  <span>{donation.donation_date}</span>
                  <strong>{donation.meals}</strong>
                  <span>{donation.description || "Kitchen Surplus"}</span>
                  <span style={{ color: donation.status === "Collected" ? "#789087" : "#e0932c", fontWeight: "bold" }}>
                    {donation.status === "Collected" ? "Delivered ✓" : "In Transit 🚴"}
                  </span>
                  <div>
                    {donation.status === "Claimed" ? (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          className="primary-button"
                          style={{ padding: "6px 12px", fontSize: "11px", background: "#1b9b5d" }}
                          onClick={() => updateDonationStatus(donation.id, "Collected")}
                        >
                          Mark Delivered ✓
                        </button>
                        <button
                          className="secondary-button"
                          style={{ padding: "6px 12px", fontSize: "11px" }}
                          onClick={() => updateDonationStatus(donation.id, "Available")}
                        >
                          Release Claim
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "13px", color: "#789087" }}>Completed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Available Pickups": return renderAvailablePickups();
      case "My Claims & History": return renderClaimsHistory();
      case "Dashboard":
      default: return renderDashboard();
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <aside className="sidebar" style={{ width: "250px", background: "#10231a", color: "white" }}>
        <div className="sidebar-logo">🌱 FoodBridge</div>
        <p className="sidebar-label">VOLUNTEER</p>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={activeMenu === item.name ? "menu-item active" : "menu-item"}
              onClick={() => setActiveMenu(item.name)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="menu-item" onClick={() => navigate("/")}>← Home</button>
          <button className="menu-item" onClick={() => navigate("/login")}>⇥ Logout</button>
        </div>
      </aside>

      <main className="dashboard-main" style={{ flex: 1, padding: "35px 45px 60px", background: "#f4f8f5" }}>
        <header className="dashboard-topbar" style={{ display: "flex", justifyContent: "space-between", marginBottom: "45px" }}>
          <div>FoodBridge / <strong>{activeMenu}</strong></div>
          <div>🚴 {activeVolunteer ? activeVolunteer.name : "Volunteer Profile"}</div>
        </header>
        <div className="dashboard-content">{renderContent()}</div>
      </main>
    </div>
  );
}

export default VolunteerDashboard;