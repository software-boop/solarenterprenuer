import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  message,
  Statistic,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  DeleteOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/district-coordinator"; // Change for production
const BRAND = "#07518a";

const Districtdash = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [token] = useState(localStorage.getItem("token"));

  // ===================== Fetch Entrepreneurs =====================
  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/entrepreneurs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntrepreneurs(res.data.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load entrepreneurs");
    } finally {
      setLoading(false);
    }
  };

  // ===================== Fetch Stats =====================
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.stats || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ===================== Actions =====================
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Entrepreneur approved");
      fetchEntrepreneurs();
      fetchStats();
    } catch (err) {
      message.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      const reason = prompt("Enter rejection reason (optional):");
      await axios.put(
        `${API_BASE}/reject/${id}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.warning("Entrepreneur rejected");
      fetchEntrepreneurs();
      fetchStats();
    } catch (err) {
      message.error("Failed to reject");
    }
  };

  const handlePending = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/pending/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.info("Entrepreneur marked as pending");
      fetchEntrepreneurs();
      fetchStats();
    } catch (err) {
      message.error("Failed to update status");
    }
  };

  // ===================== Bulk Actions =====================
  const handleBulkApprove = async () => {
    if (!selectedRowKeys.length)
      return message.warning("No entrepreneurs selected");
    try {
      await axios.put(
        `${API_BASE}/bulk-approve`,
        { ids: selectedRowKeys },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("✅ Bulk approved successfully");
      setSelectedRowKeys([]);
      fetchEntrepreneurs();
      fetchStats();
    } catch (err) {
      message.error("Failed to bulk approve");
    }
  };

  const handleBulkReject = async () => {
    if (!selectedRowKeys.length)
      return message.warning("No entrepreneurs selected");
    const reason = prompt("Enter rejection reason (optional):");
    try {
      await axios.put(
        `${API_BASE}/bulk-reject`,
        { ids: selectedRowKeys, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.warning("❌ Bulk rejected successfully");
      setSelectedRowKeys([]);
      fetchEntrepreneurs();
      fetchStats();
    } catch (err) {
      message.error("Failed to bulk reject");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length)
      return message.warning("No entrepreneurs selected");
    try {
      await axios.delete(`${API_BASE}/bulk-delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedRowKeys },
      });
      message.success("🗑️ Deleted selected entrepreneurs");
      setSelectedRowKeys([]);
      fetchEntrepreneurs();
      fetchStats();
    } catch (err) {
      message.error("Failed to bulk delete");
    }
  };

  // ===================== Excel Download =====================
  const handleDownloadExcel = () => {
    if (!entrepreneurs.length) return message.warning("No data to export");

    const sheetData = entrepreneurs.map((e) => ({
      "Full Name": e.fullname,
      Email: e.email,
      Mobile: e.mobile,
      District: e.district,
      State: e.state,
      Status: e.status,
      CreatedAt: new Date(e.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entrepreneurs");

    XLSX.writeFile(workbook, "District_Entrepreneurs.xlsx");
  };

  // ===================== Table Columns =====================
  const columns = [
    { title: "Full Name", dataIndex: "fullname", key: "fullname", responsive: ["xs", "sm", "md", "lg"] },
    { title: "Email", dataIndex: "email", key: "email", responsive: ["sm", "md", "lg"] },
    { title: "Mobile", dataIndex: "mobile", key: "mobile", responsive: ["xs", "sm", "md", "lg"] },
    { title: "District", dataIndex: "district", key: "district", responsive: ["sm", "md", "lg"] },
    { title: "State", dataIndex: "state", key: "state", responsive: ["md", "lg"] },
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
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record._id)}
            size="small"
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleReject(record._id)}
            size="small"
          >
            Reject
          </Button>
          <Button
            icon={<ClockCircleOutlined />}
            onClick={() => handlePending(record._id)}
            size="small"
          >
            Pending
          </Button>
        </Space>
      ),
    },
  ];

  // ===================== Table Row Selection =====================
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  };

  useEffect(() => {
    fetchEntrepreneurs();
    fetchStats();
  }, []);

  // ===================== Aggregate Stats =====================
  const totalAccepted = stats.reduce((acc, d) => acc + d.accepted, 0);
  const totalRejected = stats.reduce((acc, d) => acc + d.rejected, 0);
  const totalPending = stats.reduce((acc, d) => acc + d.pending, 0);
  const totalEntrepreneurs = stats.reduce((acc, d) => acc + d.total, 0);

  // ===================== UI =====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6" style={{ color: BRAND }}>
        District Coordinator Dashboard
      </h1>

      {/* Stats Overview */}
      <Row gutter={16} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Entrepreneurs" value={totalEntrepreneurs} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Accepted"
              value={totalAccepted}
              valueStyle={{ color: "green" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Rejected"
              value={totalRejected}
              valueStyle={{ color: "red" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={totalPending}
              valueStyle={{ color: "orange" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bulk Action Buttons */}
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Button
          type="primary"
          icon={<SelectOutlined />}
          onClick={() => setSelectedRowKeys(entrepreneurs.map((e) => e._id))}
        >
          Select All
        </Button>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          disabled={!selectedRowKeys.length}
          onClick={handleBulkApprove}
        >
          Bulk Approve
        </Button>
        <Button
          danger
          icon={<CloseOutlined />}
          disabled={!selectedRowKeys.length}
          onClick={handleBulkReject}
        >
          Bulk Reject
        </Button>
        <Popconfirm
          title="Are you sure you want to delete selected entrepreneurs?"
          onConfirm={handleBulkDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            disabled={!selectedRowKeys.length}
          >
            Bulk Delete
          </Button>
        </Popconfirm>
        <Button
          type="default"
          icon={<DownloadOutlined />}
          onClick={handleDownloadExcel}
        >
          Download Excel
        </Button>
      </Space>

      {/* Entrepreneurs Table */}
      <Card title="Entrepreneurs List" bordered>
        <div style={{ overflowX: "auto" }}>
          <Table
            rowKey="_id"
            loading={loading}
            columns={columns}
            dataSource={entrepreneurs}
            pagination={{ pageSize: 10 }}
            rowSelection={rowSelection}
            scroll={{ x: "max-content" }} // ✅ enables horizontal scroll
          />
        </div>
      </Card>
    </div>
  );
};

export default Districtdash;
