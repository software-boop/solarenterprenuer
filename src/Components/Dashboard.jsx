import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  message,
  Table,
  Tag,
  Space,
  Select,
  Popconfirm,
} from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  DeleteOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  FileExcelOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const BRAND = "#07518a";
const API_BASE = "https://api.brihaspathitech.com/api/admin";

export default function Dashboard() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  /* ================================
      📊 Fetch Entrepreneurs
  ================================= */
  const fetchEntrepreneurs = async (status = "All") => {
    setLoading(true);
    try {
      const endpoint =
        status === "All"
          ? `/entrepreneurs`
          : `/entrepreneurs?status=${status}`;
      const { data } = await axiosInstance.get(endpoint);
      setEntrepreneurs(data.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load entrepreneurs ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================================
      📊 Fetch Districts
  ================================= */
  const fetchDistricts = async () => {
    try {
      const res = await axiosInstance.get(`/district-stats`);
      setDistricts(res.data.stats || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntrepreneurs(filterStatus);
    fetchDistricts();
  }, [filterStatus]);

  /* ================================
      📦 Download Excel (Filtered)
  ================================= */
  const downloadExcel = () => {
    if (!entrepreneurs.length) {
      message.warning("No data available ⚠️");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      entrepreneurs.map((e) => ({
        Name: e.fullname,
        Email: e.email,
        Mobile: e.mobile,
        District: e.district,
        Status: e.status,
        RegisteredAt: new Date(e.createdAt).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Entrepreneurs");
    XLSX.writeFile(
      wb,
      `Solar_Entrepreneurs_${filterStatus || "All"}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    );
    message.success(`Excel downloaded (${filterStatus}) 📊`);
  };

  /* ================================
      ✅ Single / Bulk Actions
  ================================= */
  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/approve/${id}`);
      message.success("Approved ✅");
      fetchEntrepreneurs(filterStatus);
    } catch {
      message.error("Failed to approve ❌");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await axiosInstance.put(`/reject/${id}`, { reason });
      message.warning("Rejected ❌");
      fetchEntrepreneurs(filterStatus);
    } catch {
      message.error("Failed to reject ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/delete/${id}`);
      message.success("Deleted 🗑️");
      fetchEntrepreneurs(filterStatus);
    } catch {
      message.error("Failed to delete ❌");
    }
  };

  // ✅ Smart selection helpers
  const autoSelectForApprove = () => {
    const ids = entrepreneurs
      .filter((e) => e.status !== "Accepted" && e.status !== "Deleted")
      .map((e) => e._id);
    if (!ids.length)
      return message.info("All entrepreneurs are already approved ✅");
    setSelectedRowKeys(ids);
    return ids;
  };

  const autoSelectForReject = () => {
    const ids = entrepreneurs
      .filter((e) => e.status !== "Rejected" && e.status !== "Deleted" && e.status !== "Accepted")
      .map((e) => e._id);
    if (!ids.length)
      return message.info("All entrepreneurs are already rejected or approved ❌");
    setSelectedRowKeys(ids);
    return ids;
  };

  const handleBulkApprove = async () => {
    const ids = autoSelectForApprove();
    if (!ids || !ids.length) return;

    try {
      await axiosInstance.post(`/bulk-approve`, { ids });
      message.success(`Approved ${ids.length} entries ✅`);
      setSelectedRowKeys([]);
      fetchEntrepreneurs(filterStatus);
    } catch {
      message.error("Bulk approve failed ❌");
    }
  };

  const handleBulkReject = async () => {
    const ids = autoSelectForReject();
    if (!ids || !ids.length) return;

    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await axiosInstance.post(`/bulk-reject`, { ids, reason });
      message.warning(`Rejected ${ids.length} entries ❌`);
      setSelectedRowKeys([]);
      fetchEntrepreneurs(filterStatus);
    } catch {
      message.error("Bulk reject failed ❌");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length)
      return message.warning("Select at least one entry to delete");
    try {
      await axiosInstance.post(`/bulk-delete`, { ids: selectedRowKeys });
      message.success(`Deleted ${selectedRowKeys.length} entries 🗑️`);
      setSelectedRowKeys([]);
      fetchEntrepreneurs(filterStatus);
    } catch {
      message.error("Bulk delete failed ❌");
    }
  };

  const handleBulkApproveDistrict = async () => {
    if (!selectedDistrict)
      return message.warning("Select a district first");
    try {
      const { data } = await axiosInstance.get(
        `/entrepreneurs?district=${selectedDistrict}&status=Pending`
      );
      const ids = (data.data || []).map((e) => e._id);
      if (!ids.length)
        return message.info(`No pending entrepreneurs in ${selectedDistrict}`);
      await axiosInstance.post(`/bulk-approve`, { ids });
      message.success(`Approved all from ${selectedDistrict} ✅`);
      fetchEntrepreneurs(filterStatus);
    } catch {
      message.error("District approval failed ❌");
    }
  };

  /* ================================
      📋 Table Columns
  ================================= */
  const columns = [
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
      fixed: "left",
      width: 180,
    },
    { title: "Email", dataIndex: "email", key: "email", width: 200 },
    { title: "Mobile", dataIndex: "mobile", key: "mobile", width: 140 },
    { title: "District", dataIndex: "district", key: "district", width: 160 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => {
        const color =
          status === "Accepted"
            ? "green"
            : status === "Rejected"
            ? "red"
            : status === "Deleted"
            ? "gray"
            : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 260,
      render: (_, record) => {
        // ✅ Hide both Approve & Reject for Accepted/Rejected/Deleted
        const showApprove = record.status === "Pending";
        const showReject = record.status === "Pending";

        return (
          <Space>
            {showApprove && (
              <Button
                type="primary"
                size="small"
                style={{ backgroundColor: BRAND }}
                onClick={() => handleApprove(record._id)}
              >
                Approve
              </Button>
            )}
            {showReject && (
              <Button
                danger
                size="small"
                onClick={() => handleReject(record._id)}
              >
                Reject
              </Button>
            )}
            <Popconfirm
              title="Delete this entrepreneur?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button
                size="small"
                icon={<DeleteOutlined />}
                style={{ borderColor: "gray" }}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  /* ================================
      🧱 UI
  ================================= */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ paddingTop: "3rem" }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ color: BRAND, fontWeight: "bold", fontSize: 28 }}>
          ☀️ Solar Entrepreneur Admin Dashboard
        </h1>

        <Space>
          <Select
            value={filterStatus}
            style={{ width: 180 }}
            onChange={(v) => setFilterStatus(v)}
            options={[
              { label: "All", value: "All" },
              { label: "Pending", value: "Pending" },
              { label: "Accepted", value: "Accepted" },
              { label: "Rejected", value: "Rejected" },
              { label: "Deleted", value: "Deleted" },
            ]}
            suffixIcon={<FilterOutlined />}
          />
          <Button
            icon={<FileExcelOutlined />}
            style={{
              backgroundColor: "#198754",
              color: "white",
              borderColor: "#198754",
            }}
            onClick={downloadExcel}
          >
            Download Excel
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchEntrepreneurs(filterStatus)}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* DISTRICT BULK ACTIONS */}
      <Card
        style={{
          borderTop: `3px solid ${BRAND}`,
          marginBottom: "1.5rem",
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(7,81,138,0.1)",
        }}
      >
        <Space wrap>
          <Select
            placeholder="Select District"
            style={{ width: 250 }}
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            options={districts.map((d) => ({
              label: d.district,
              value: d.district,
            }))}
          />
          <Button
            type="primary"
            icon={<CheckOutlined />}
            style={{ backgroundColor: BRAND }}
            onClick={handleBulkApproveDistrict}
          >
            Approve All (District)
          </Button>
        </Space>
      </Card>

      {/* TABLE + BULK BUTTONS */}
      <Card
        title="Entrepreneur Management"
        style={{
          borderTop: `3px solid ${BRAND}`,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Space style={{ marginBottom: 12, flexWrap: "wrap" }}>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleBulkApprove}
            style={{ backgroundColor: BRAND }}
          >
            Bulk Approve (Auto Select)
          </Button>
          <Button danger icon={<CloseOutlined />} onClick={handleBulkReject}>
            Bulk Reject (Auto Select)
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={handleBulkDelete}
            disabled={!selectedRowKeys.length}
          >
            Bulk Delete (Manual)
          </Button>
        </Space>

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={entrepreneurs}
          pagination={{ pageSize: 8 }}
          rowSelection={rowSelection}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </motion.div>
  );
}
