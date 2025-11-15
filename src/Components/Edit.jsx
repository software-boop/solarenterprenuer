import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";

const { Title } = Typography;
const { Option } = Select;
const BRAND = "#07518a";

/* ✅ District List */
const districts = [
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

export default function CreateCoordinator() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  /* ======================================================
     🧩 Submit Handler
  ====================================================== */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // ✅ Confirm before submit
      const confirm = window.confirm(
        `Are you sure you want to create coordinator for ${values.district}?`
      );
      if (!confirm) {
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "https://api.brihaspathitech.com/api/admin/create-coordinator",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Coordinator created successfully 🎉");
      form.resetFields();
    } catch (err) {
      const msg = err.response?.data?.message;

      // ✅ Handle duplicate coordinator case
      if (msg && msg.toLowerCase().includes("already")) {
        toast.error(`❌ ${msg}`);
      } else {
        toast.error(msg || "Failed to create coordinator ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-blue-50 p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ height: "100vh" }}
    >
      <Toaster position="top-center" />
      <Card
        className="shadow-2xl w-full max-w-4xl rounded-2xl"
        style={{
          borderTop: `5px solid ${BRAND}`,
          borderRadius: "14px",
          padding: "2rem 2.5rem",
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <motion.img
            src="https://www.brihaspathi.com/highbtlogo%20tm%20(1).png"
            alt="BTPL Logo"
            className="w-28 mx-auto mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <Title level={3} style={{ color: BRAND, marginBottom: 0 }}>
            Create District Coordinator
          </Title>
          <p className="text-gray-600 text-sm">
            Assign a single district to a new coordinator
          </p>
        </div>

        <Divider />

        {/* Form */}
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          requiredMark={false}
          autoComplete="off"
        >
          <Row gutter={24}>
            {/* Left Column - Personal Info */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Full Name"
                name="fullname"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input
                  placeholder="Enter coordinator name"
                  size="large"
                  autoComplete="off"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input
                  placeholder="Enter email address"
                  size="large"
                  autoComplete="off"
                />
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
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  size="large"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            {/* Right Column - Account Info */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter password" },
                  {
                    min: 8,
                    message:
                      "Password must be at least 8 characters (use numbers & symbols)",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Set a strong password"
                  size="large"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                label="Select District"
                name="district"
                rules={[{ required: true, message: "Please select a district" }]}
              >
                <Select
                  placeholder="Select one district"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  size="large"
                >
                  {districts.map((d) => (
                    <Option key={d} value={d}>
                      {d}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button - Centered */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1.5rem",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                backgroundColor: BRAND,
                borderColor: BRAND,
                padding: "0 50px",
                height: "46px",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {loading ? "Creating..." : "Create Coordinator"}
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
}
