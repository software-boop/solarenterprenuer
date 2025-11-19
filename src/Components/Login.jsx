import React, { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const BRAND = "#07518a";
const LOGO = "https://www.brihaspathi.com/highbtlogo%20tm%20(1).png";
const API_URL = "https://api.brihaspathi.com/api/auth/login";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ==========================================================
     🔐 Handle Login (Admin + District Coordinator)
  =========================================================== */
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(API_URL, values);
      const { token, user, role, message } = res.data;

      if (!token || !user) {
        toast.error("Invalid response from server. Please try again.");
        return;
      }

      // ✅ Success message
      toast.success(message || "Login successful 🎉");

      // 🧩 Save auth session
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      // Normalize role
      const userRole = role?.toLowerCase();

      // 🧭 Redirect
      setTimeout(() => {
        if (userRole === "admin") navigate("/admin", { replace: true });
        else if (userRole === "district") navigate("/district-cordinator", { replace: true });
        else navigate("/", { replace: true });
      }, 600);
    } catch (err) {
      // ❌ Handle login failure
      const msg =
        err.response?.data?.message ||
        "Invalid credentials. Please check your email or password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     🧩 Render UI
  =========================================================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07518a] to-blue-400 px-4">
      <Toaster position="top-right" />

      <motion.div
        className="w-full max-w-md p-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          bordered={false}
          className="rounded-2xl shadow-2xl"
          style={{
            backgroundColor: "white",
            borderTop: `4px solid ${BRAND}`,
          }}
        >
          {/* 🔷 Logo & Title */}
          <div className="flex flex-col items-center mb-6 text-center">
            <motion.img
              src={LOGO}
              alt="Brihaspathi Logo"
              className="w-36 mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
            />
            <Text type="secondary">
              Sign in as <b>Admin</b> or <b>District Coordinator</b>
            </Text>
          </div>

          {/* 🔐 Login Form */}
          <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your email"
                prefix={<MailOutlined className="text-gray-500" />}
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter your password"
                prefix={<LockOutlined className="text-gray-500" />}
                autoComplete="current-password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="w-full rounded-md mt-3"
              style={{
                backgroundColor: BRAND,
                borderColor: BRAND,
                fontWeight: 500,
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          {/* Forgot Password (Optional) */}
          {/* <div className="text-right mt-3">
            <a
              href="#"
              onClick={() => toast("Please contact the admin to reset your password.")}
              style={{ color: BRAND }}
            >
              Forgot password?
            </a>
          </div> */}
        </Card>

        {/* Footer */}
        <motion.div
          className="text-center mt-6 text-white text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Powered by{" "}
          <a
            href="https://www.brihaspathi.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline"
          >
            Brihaspathi Technologies Limited
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
