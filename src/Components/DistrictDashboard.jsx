import React, { useEffect, useState } from "react";
import {
  Card,
  Statistic,
  Row,
  Col,
  message,
  Spin,
  Tag,
  Table,
} from "antd";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const API_BASE = "https://api.brihaspathitech.com/api/district-coordinator"; // Change for production
const BRAND = "#07518a";

const DistrictDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [stats, setStats] = useState({ weekly: [], todayCount: 0 });
  const [token] = useState(localStorage.getItem("token"));

  // ===================== Fetch Entrepreneurs =====================
  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/entrepreneursfetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data || [];
      setEntrepreneurs(data);
      computeStats(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load entrepreneurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrepreneurs();
    const interval = setInterval(fetchEntrepreneurs, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // ===================== Compute Stats =====================
  const computeStats = (data) => {
    const today = new Date().toISOString().split("T")[0];
    const todayCount = data.filter(
      (e) => e.createdAt && e.createdAt.startsWith(today)
    ).length;

    // weekly registrations (last 7 days)
    const weekMap = {};
    data.forEach((e) => {
      const date = new Date(e.createdAt);
      const day = date.toISOString().split("T")[0];
      weekMap[day] = (weekMap[day] || 0) + 1;
    });

    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const day = d.toISOString().split("T")[0];
        return {
          day,
          count: weekMap[day] || 0,
        };
      })
      .reverse();

    setStats({ weekly: last7Days, todayCount });
  };

  // ===================== Summary Counts =====================
  const total = entrepreneurs.length;
  const accepted = entrepreneurs.filter((e) => e.status === "Accepted").length;
  const rejected = entrepreneurs.filter((e) => e.status === "Rejected").length;
  const pending = entrepreneurs.filter((e) => e.status === "Pending").length;

  // ===================== Table =====================
  const columns = [
    { title: "Name", dataIndex: "fullname", key: "fullname" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    { title: "District", dataIndex: "formDistrict", key: "formDistrict" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Accepted"
            ? "green"
            : status === "Rejected"
            ? "red"
            : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  // ===================== UI =====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: BRAND }}>
        📊 District Coordinator Analytics Dashboard
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* ====== Summary Cards ====== */}
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Total Registered"
                  value={total}
                  prefix={<UserOutlined style={{ color: BRAND }} />}
                  valueStyle={{ color: BRAND }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Today's Registrations"
                  value={stats.todayCount}
                  prefix={<CalendarOutlined style={{ color: "#16a34a" }} />}
                  valueStyle={{ color: "#16a34a" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Accepted"
                  value={accepted}
                  prefix={<CheckCircleOutlined style={{ color: "green" }} />}
                  valueStyle={{ color: "green" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Pending"
                  value={pending}
                  prefix={<ClockCircleOutlined style={{ color: "orange" }} />}
                  valueStyle={{ color: "orange" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable>
                <Statistic
                  title="Rejected"
                  value={rejected}
                  prefix={<CloseCircleOutlined style={{ color: "red" }} />}
                  valueStyle={{ color: "red" }}
                />
              </Card>
            </Col>
          </Row>

          {/* ====== Weekly Bar Chart ====== */}
          <Card
            title="📅 Weekly Registration Trend"
            style={{
              borderRadius: 12,
              marginBottom: 24,
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            }}
          >
            {stats.weekly.length ? (
              <div style={{ overflowX: "auto" }}>
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: stats.weekly.map((d) =>
                        d.day.slice(5).replace("-", "/")
                      ),
                      label: "Date",
                    },
                  ]}
                  series={[
                    {
                      data: stats.weekly.map((d) => d.count),
                      label: "Registrations",
                      color: BRAND,
                    },
                  ]}
                  width={600}
                  height={300}
                />
              </div>
            ) : (
              <p>No data available for this week</p>
            )}
          </Card>

          {/* ====== Recent Table ====== */}
          <Card
            title="🧾 Recently Registered Entrepreneurs"
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <Table
                rowKey="_id"
                columns={columns}
                dataSource={entrepreneurs
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 10)}
                pagination={false}
                scroll={{ x: "max-content" }}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default DistrictDashboard;
