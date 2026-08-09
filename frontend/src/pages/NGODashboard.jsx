import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hackmatrix-mi53.onrender.com";

function NGODashboard() {
  const navigate = useNavigate();

  // Navigation menu state
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Donations State
  const [donations, setDonations] = useState([]);
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationSummary, setDonationSummary] = useState({
    total_donations: 0,
    total_meals_donated: 0,
    available_meals: 0,
    claimed_meals: 0,
  });

  // Load initial data
  useEffect(() => {
    fetchDonations();
    fetchDonationSummary();
  }, []);

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

  const updateDonationStatus = async (donationId, status) => {
    try {
      const response = await fetch(
        `${API_URL}/api/donations/${donationId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update donation");
      
      alert(`Donation status updated to: ${status}`);
      fetchDonations();
      fetchDonationSummary();
    } catch (error) {
      console.error("Donation status error:", error);
      alert(error.message);
    }
  };

  // Navigation items
  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Available Food", icon: "🍱" },
    { name: "My Claims & Received", icon: "🤝" },
  ];

  // =====================================================
  // SUB-VIEWS
  // =====================================================

  const renderDashboard = () => {
    const availableDonations = donations.filter((d) => d.status === "Available");
    const claimedByNGO = donations.filter((d) => d.status === "Claimed" || d.status === "Collected");

    return (
      <div className="prediction-page">
        <div className="prediction-heading">
          <div>
            <p className="dashboard-label">NGO PORTAL</p>
            <h1>Bridge the gap. End hunger.</h1>
            <p>
              Coordinate directly with local commercial kitchens, claim fresh surplus food, and distribute it to families in need.
            </p>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="stat-grid">
          <div className="stat-card">
            <p>Available Surplus Meals</p>
            <strong>{donationSummary.available_meals}</strong>
          </div>
          <div className="stat-card">
            <p>Total Meals Redirected</p>
            <strong>{donationSummary.total_meals_donated}</strong>
          </div>
          <div className="stat-card">
            <p>Claimed & In-Transit</p>
            <strong>{donationSummary.claimed_meals}</strong>
          </div>
          <div className="stat-card">
            <p>Active Claims</p>
            <strong>{claimedByNGO.filter(c => c.status === "Claimed").length}</strong>
          </div>
        </div>

        {/* DUAL PANELS */}
        <div className="dashboard-grid">
          {/* Available Food */}
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="dashboard-label">URGENT NEED</p>
                <h2>Surplus Available Now</h2>
              </div>
              <button className="small-button" onClick={fetchDonations}>↻</button>
            </div>
            <div className="historical-table" style={{ marginTop: "15px" }}>
              <div className="table-row table-header">
                <span>Date</span>
                <span>Meals</span>
                <span>Description</span>
                <span>Action</span>
              </div>
              {availableDonations.slice(0, 5).map((d) => (
                <div className="table-row" key={d.id}>
                  <span>{d.donation_date}</span>
                  <strong>{d.meals}</strong>
                  <span>{d.description || "Kitchen Surplus"}</span>
                  <button
                    className="primary-button"
                    style={{ padding: "6px 12px", fontSize: "11px" }}
                    onClick={() => updateDonationStatus(d.id, "Claimed")}
                  >
                    Claim 🤝
                  </button>
                </div>
              ))}
              {availableDonations.length === 0 && (
                <div style={{ padding: "20px", textAlign: "center", color: "#789087" }}>
                  No available meals at this moment. Check back soon!
                </div>
              )}
            </div>
          </section>

          {/* Claimed/Completed list */}
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="dashboard-label">YOUR ORDERS</p>
                <h2>Claimed Food Shipments</h2>
              </div>
            </div>
            <div className="historical-table" style={{ marginTop: "15px" }}>
              <div className="table-row table-header">
                <span>Meals</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {claimedByNGO.map((d) => (
                <div className="table-row" key={d.id}>
                  <strong>{d.meals} meals</strong>
                  <span style={{
                    color: d.status === "Collected" ? "#789087" : "#e0932c",
                    fontWeight: "bold"
                  }}>
                    {d.status === "Collected" ? "Collected ✓" : "Claimed (In Transit)"}
                  </span>
                  <div>
                    {d.status === "Claimed" ? (
                      <button
                        className="secondary-button"
                        style={{ padding: "6px 12px", fontSize: "11px" }}
                        onClick={() => updateDonationStatus(d.id, "Available")}
                      >
                        Cancel Claim
                      </button>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#789087" }}>Received</span>
                    )}
                  </div>
                </div>
              ))}
              {claimedByNGO.length === 0 && (
                <div style={{ padding: "20px", textAlign: "center", color: "#789087" }}>
                  You have not claimed any active donations.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderAvailableFood = () => {
    const availableDonations = donations.filter((d) => d.status === "Available");

    return (
      <div className="prediction-page">
        <div className="prediction-heading">
          <div>
            <p className="dashboard-label">DISTRIBUTION</p>
            <h1>Available Kitchen Surplus</h1>
            <p>Claim meals below so our registered volunteer network can pick them up and deliver them to your center.</p>
          </div>
          <button className="small-button" onClick={fetchDonations}>↻ Refresh List</button>
        </div>

        <section className="historical-section">
          <div className="historical-table">
            <div className="table-row table-header">
              <span>Date</span>
              <span>Meals Count</span>
              <span>Description</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {donationLoading ? (
              <div className="table-row"><span>Loading available donations...</span></div>
            ) : availableDonations.length === 0 ? (
              <div className="table-row"><span>No active surplus meals listed by kitchens today.</span></div>
            ) : (
              availableDonations.map((donation) => (
                <div className="table-row" key={donation.id}>
                  <span>{donation.donation_date}</span>
                  <strong>{donation.meals}</strong>
                  <span>{donation.description || "Fresh Surplus"}</span>
                  <span style={{ color: "#1b9b5d", fontWeight: "bold" }}>{donation.status}</span>
                  <button
                    className="primary-button"
                    style={{ padding: "8px 16px" }}
                    onClick={() => updateDonationStatus(donation.id, "Claimed")}
                  >
                    Request / Claim Donation 🤝
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  };

  const renderClaimsReceived = () => {
    const myClaims = donations.filter((d) => d.status === "Claimed" || d.status === "Collected");

    return (
      <div className="prediction-page">
        <div className="prediction-heading">
          <div>
            <p className="dashboard-label">COLLECTIONS</p>
            <h1>Your Claims & Received Shipments</h1>
            <p>Track food shipments currently in transit or mark them as received once they arrive at your facility.</p>
          </div>
          <button className="small-button" onClick={fetchDonations}>↻ Refresh List</button>
        </div>

        <section className="historical-section">
          <div className="historical-table">
            <div className="table-row table-header">
              <span>Date</span>
              <span>Meals Count</span>
              <span>Description</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {donationLoading ? (
              <div className="table-row"><span>Loading claims history...</span></div>
            ) : myClaims.length === 0 ? (
              <div className="table-row"><span>You have not made any claims yet.</span></div>
            ) : (
              myClaims.map((donation) => (
                <div className="table-row" key={donation.id}>
                  <span>{donation.donation_date}</span>
                  <strong>{donation.meals}</strong>
                  <span>{donation.description || "Kitchen Surplus"}</span>
                  <span style={{
                    color: donation.status === "Collected" ? "#789087" : "#e0932c",
                    fontWeight: "bold"
                  }}>
                    {donation.status === "Collected" ? "Received ✓" : "In Transit (Claimed)"}
                  </span>
                  <div>
                    {donation.status === "Claimed" ? (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          className="primary-button"
                          style={{ padding: "6px 12px", fontSize: "11px", background: "#1b9b5d" }}
                          onClick={() => updateDonationStatus(donation.id, "Collected")}
                        >
                          Confirm Received ✓
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
                      <span style={{ fontSize: "13px", color: "#789087" }}>Successfully Delivered</span>
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
      case "Available Food":
        return renderAvailableFood();
      case "My Claims & Received":
        return renderClaimsReceived();
      case "Dashboard":
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside className="sidebar" style={{ width: "250px", background: "#10231a", color: "white" }}>
        <div className="sidebar-logo">🌱 FoodBridge</div>
        <p className="sidebar-label">NGO PORTAL</p>
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
          <button className="menu-item" onClick={() => navigate("/")}>
            ← Home
          </button>
          <button className="menu-item" onClick={() => navigate("/login")}>
            ⇥ Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main" style={{ flex: 1, padding: "35px 45px 60px", background: "#f4f8f5" }}>
        <header className="dashboard-topbar" style={{ display: "flex", justifyContent: "space-between", marginBottom: "45px" }}>
          <div>
            <span>FoodBridge</span> / <strong>{activeMenu}</strong>
          </div>
          <div>
            🤝 NGO Partner
          </div>
        </header>

        <div className="dashboard-content">{renderContent()}</div>
      </main>
    </div>
  );
}

export default NGODashboard;