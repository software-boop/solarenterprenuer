import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spin } from "antd";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BRAND = "#07518a";
const API_BASE = "https://api.brihaspathitech.com/api/admin";

// ✅ Andhra Pradesh Districts (25)
const districtsList = [
  "Alluri Sitarama Raju",
  "Anakapalli",
  "Anantapur",
  "Annamayya",
  "Bapatla",
  "Chittoor",
  "East Godavari",
  "Eluru",
  "Guntur",
  "Kakinada",
  "Konaseema",
  "Krishna",
  "Kurnool",
  "Nandyal",
  "NTR",
  "Palnadu",
  "Parvathipuram Manyam",
  "Prakasam",
  "Sri Potti Sriramulu Nellore",
  "Srikakulam",
  "Tirupati",
  "Visakhapatnam",
  "Vizianagaram",
  "West Godavari",
  "YSR Kadapa",
];

export default function DistrictStats() {
  const [districtStats, setDistrictStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overall, setOverall] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/district-stats`);
        console.log("📊 API Response:", res.data);

        const apiData =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.stats)
            ? res.data.stats
            : Array.isArray(res.data.data)
            ? res.data.data
            : [];

        // ✅ Fill missing districts with 0s
        const completeData = districtsList.map((district) => {
          const found = apiData.find(
            (d) => d.district?.toLowerCase() === district.toLowerCase()
          );
          return {
            district,
            accepted: found?.accepted || 0,
            rejected: found?.rejected || 0,
            pending: found?.pending || 0,
          };
        });

        setDistrictStats(completeData);

        const totals = completeData.reduce(
          (acc, d) => ({
            total:
              acc.total +
              ((d.accepted || 0) + (d.rejected || 0) + (d.pending || 0)),
            accepted: acc.accepted + (d.accepted || 0),
            rejected: acc.rejected + (d.rejected || 0),
            pending: acc.pending + (d.pending || 0),
          }),
          { total: 0, accepted: 0, rejected: 0, pending: 0 }
        );

        setOverall(totals);
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
        setDistrictStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ✅ Chart.js Data
  const chartData = {
    labels: districtStats.map((d) => d.district),
    datasets: [
      {
        label: "Accepted",
        data: districtStats.map((d) => d.accepted || 0),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "#22c55e",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Rejected",
        data: districtStats.map((d) => d.rejected || 0),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "#ef4444",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Pending",
        data: districtStats.map((d) => d.pending || 0),
        backgroundColor: "rgba(250, 204, 21, 0.8)",
        borderColor: "#facc15",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#1f2937",
          font: { size: 13, weight: "500" },
        },
      },
      title: {
        display: true,
        text: "📈 District-wise Application Overview (All 25 Districts)",
        font: { size: 18, weight: "bold" },
        color: BRAND,
        padding: { top: 20, bottom: 30 },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#374151",
          font: { size: 10, weight: "500" },
          maxRotation: 60,
          minRotation: 30,
        },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#374151", stepSize: 5 },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <Spin size="large" />
        <p style={{ color: "#555", marginTop: "12px" }}>
          Loading district statistics...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        marginTop: "2rem",
        padding: "0 1rem",
      }}
    >
      {/* ===== Overall Summary ===== */}
      <Row gutter={[16, 16]} style={{ marginBottom: "1.5rem" }}>
        {[
          { title: "Total Registrations", color: BRAND, value: overall.total },
          { title: "Total Approved", color: "#22c55e", value: overall.accepted },
          { title: "Total Rejected", color: "#ef4444", value: overall.rejected },
          { title: "Total Pending", color: "#facc15", value: overall.pending },
        ].map((stat, index) => (
          <Col xs={12} sm={12} md={6} key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                hoverable
                style={{
                  borderTop: `3px solid ${stat.color}`,
                  borderRadius: 12,
                  textAlign: "center",
                  background: "#ffffff",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                }}
              >
                <h3 style={{ color: stat.color, fontWeight: 700 }}>
                  {stat.title}
                </h3>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: 0,
                  }}
                >
                  {stat.value}
                </p>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* ===== District-wise Chart ===== */}
      <Card
        style={{
          borderTop: `4px solid ${BRAND}`,
          borderRadius: 12,
          marginBottom: "2rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {!districtStats.length ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            No district data available yet.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ height: "550px", padding: "10px" }}
          >
            <Bar data={chartData} options={chartOptions} />
          </motion.div>
        )}
      </Card>

      {/* ===== Individual District Cards ===== */}
      <Row gutter={[16, 16]} justify="center">
        {districtStats.map((d, i) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <Card
                hoverable
                size="small"
                style={{
                  textAlign: "center",
                  borderRadius: 12,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    color: BRAND,
                    fontSize: "1rem",
                    marginBottom: 6,
                  }}
                >
                  {d.district}
                </p>
                <p style={{ margin: 2, color: "#22c55e" }}>
                  ✅ Accepted: {d.accepted || 0}
                </p>
                <p style={{ margin: 2, color: "#ef4444" }}>
                  ❌ Rejected: {d.rejected || 0}
                </p>
                <p style={{ margin: 2, color: "#eab308" }}>
                  ⏳ Pending: {d.pending || 0}
                </p>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
}
