import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Popconfirm,
  Tag,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const { Title } = Typography;
const BRAND = "#07518a";
const API_BASE = "http://localhost:5000/api/admin";

export default function ManageCoordinators() {
  const [loading, setLoading] = useState(false);
  const [coordinators, setCoordinators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  /* ======================================================
     🔐 Auth Header
  ====================================================== */
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  /* ======================================================
     📥 Fetch Coordinators
  ====================================================== */
  const fetchCoordinators = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/cordinator`, getAuthHeaders());
      const data = res.data?.data?.map((c) => ({ ...c, id: c._id || c.id }));
      setCoordinators(data || []);
    } catch (err) {
      toast.error("❌ Failed to fetch coordinators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  /* ======================================================
     ✏️ Edit Handler
  ====================================================== */
  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      fullname: record.fullname,
      email: record.email,
      mobile: record.mobile,
      district: record.district,
      password: "",
    });
    setIsModalOpen(true);
  };

  /* ======================================================
     💾 Update Coordinator
  ====================================================== */
  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const id = editing.id || editing._id;

      // Prepare update payload
      const payload = {
        fullname: values.fullname,
        email: values.email,
        mobile: values.mobile,
      };
      if (values.password && values.password.trim() !== "") {
        payload.password = values.password;
      }

      const res = await axios.put(
        `${API_BASE}/district-coordinator/${id}`,
        payload,
        getAuthHeaders()
      );

      // ✅ Determine type of change from backend response
      const { message, changes } = res.data || {};
      if (changes?.emailChanged) {
        toast.success("📧 Coordinator email updated — new credentials sent!");
      } else if (changes?.passwordChanged) {
        toast.success("🔐 Password updated — notification email sent!");
      } else {
        toast.success(message || "✅ Coordinator updated successfully");
      }

      // Refresh & close modal
      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchCoordinators();
    } catch (err) {
      const msg =
        err.response?.data?.message || "❌ Failed to update coordinator";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     🗑️ Delete Coordinator
  ====================================================== */
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      const id = record.id || record._id;
      await axios.delete(
        `${API_BASE}/district-coordinators/${id}`,
        getAuthHeaders()
      );
      toast.success("🗑️ Coordinator deleted successfully");
      fetchCoordinators();
    } catch (err) {
      const msg =
        err.response?.data?.message || "❌ Failed to delete coordinator";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     📊 Table Columns
  ====================================================== */
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      ellipsis: true,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
      render: (d) => (
        <Tag color="blue" style={{ fontWeight: 500, borderRadius: "8px" }}>
          {d}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space wrap>
          <Button
            size="small"
            style={{ backgroundColor: BRAND, color: "white" }}
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this coordinator?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ======================================================
     🧱 Render UI
  ====================================================== */
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster position="top-center" />

      {/* Header Section */}
      <Row justify="space-between" align="middle" className="mb-6">
        <Col xs={24} sm={12}>
          <Title
            level={3}
            style={{
              color: BRAND,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            👩‍💼 Manage District Coordinators
          </Title>
        </Col>
        <Col xs={24} sm={12} className="flex justify-center sm:justify-end">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchCoordinators}
            loading={loading}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <Table
          bordered
          size="middle"
          rowKey={(r) => r.id || r._id}
          loading={loading}
          columns={columns}
          dataSource={coordinators}
          pagination={{
            pageSize: 6,
            position: ["bottomCenter"],
            showSizeChanger: false,
          }}
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* Edit Modal */}
      <Modal
        open={isModalOpen}
        title={
          <span style={{ color: BRAND, fontWeight: 600 }}>
            ✏️ Edit Coordinator
          </span>
        }
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        footer={null}
        centered
        width={window.innerWidth < 640 ? "95%" : 650}
      >
        <Form layout="vertical" form={form} onFinish={handleUpdate}>
          <Row gutter={[24, 8]}>
            {/* LEFT SIDE */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Full Name"
                name="fullname"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input placeholder="Enter full name" size="large" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input placeholder="Enter email address" size="large" />
              </Form.Item>

              <Form.Item
                label="Mobile"
                name="mobile"
                rules={[
                  { required: true, message: "Please enter mobile number" },
                  {
                    pattern: /^[6-9]\d{9}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                ]}
              >
                <Input
                  placeholder="Enter mobile number"
                  maxLength={10}
                  size="large"
                />
              </Form.Item>
            </Col>

            {/* RIGHT SIDE */}
            <Col xs={24} md={12}>
              <Form.Item label="District" name="district">
                <Input
                  disabled
                  size="large"
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#555",
                    cursor: "not-allowed",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Change Password (Optional)"
                name="password"
                rules={[
                  {
                    min: 8,
                    message:
                      "Password must be at least 8 characters (use numbers & symbols)",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  size="large"
                  prefix={<LockOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="text-center mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                backgroundColor: BRAND,
                borderColor: BRAND,
                width: "100%",
                borderRadius: "8px",
              }}
            >
              Update Coordinator
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
}
