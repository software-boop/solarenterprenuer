import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Button,
  Menu,
  Layout,
  Drawer,
  Tooltip,
} from "antd";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

// Logos
import B_white from "../../src/assets/Logos/only B logo white (1).png";
import B_blues from "../../src/assets/Logos/only B logo (1).png";

const { Header, Sider, Content } = Layout;

/* 🎨 District Coordinator Theme */
const BRAND = {
  primary: "#07518a",
  // secondary: "#0ea5e9",
  // lightBg: "#f1f5f9",
  white: "#ffffff",
  textDark: "#1f2937",
};

export default function DistrictLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* 🔁 Responsive Handling */
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 992;
      setMobile(isMobile);
      if (!isMobile) setDrawerOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* 🔥 Active Tab Logic */
  const getSelectedKey = () => {
    if (location.pathname === "/district-coordinator") return "1";
    if (location.pathname.includes("aprovals")) return "2";
    return "1";
  };

  /* 📌 Sidebar Menu Items */
  const menuItems = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/district-cordinator"),
    },
    {
      key: "2",
      icon: <PieChartOutlined />,
      label: "Approvals",
      onClick: () => navigate("aprovals"),
    },
  ];

  /* 🧱 Sidebar Content */
  const SidebarContent = (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Section */}
      <div
        style={{
          background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.secondary})`,
          padding: collapsed ? "10px" : "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          transition: "0.3s",
        }}
      >
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={collapsed ? B_blues : "https://www.brihaspathi.com/highbtlogo%20tm%20(1).png"}
          alt="BTL Logo"
          style={{
            height: collapsed ? "28px" : "42px",
            objectFit: "contain",
            transition: "0.3s",
          }}
        />

        {!mobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: BRAND.primary, background: "rgba(255,255,255,0.25)", borderRadius: 8 }}
          />
        )}
      </div>

      {/* Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{ padding: "16px 10px", fontWeight: 500 }}
      />
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: BRAND.lightBg }}>
      {/* Desktop Sidebar */}
      {!mobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={250}
          collapsedWidth={70}
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            background: BRAND.white,
            borderRight: "1px solid #dbeafe",
            boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
          }}
        >
          {SidebarContent}
        </Sider>
      )}

      {/* Mobile Sidebar */}
      {mobile && (
        <Drawer
          placement="left"
          closable={false}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          bodyStyle={{ padding: 0 }}
          width={220}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* Main Page Layout */}
      <Layout
        style={{
          marginLeft: !mobile ? (collapsed ? 70 : 250) : 0,
          transition: "0.3s ease",
        }}
      >
        {/* Header */}
        <Header
          style={{
            height: 70,
            background: BRAND.white,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #dbeafe",
            position: "fixed",
            top: 0,
            left: !mobile ? (collapsed ? 70 : 250) : 0,
            right: 0,
            zIndex: 2000,
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {mobile && (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ fontSize: 22, color: BRAND.primary }}
              />
            )}

            <h1
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)",
                color: BRAND.primary,
                letterSpacing: "-0.03em",
              }}
            >
              District Coordinator
            </h1>
          </div>

          {/* Right */} 
          <Tooltip title="Logout">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              style={{ color: "#ef4444", fontSize: 18 }}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            />
          </Tooltip>
        </Header>

        {/* Page Content */}
        <Content
          style={{
            marginTop: 70,
            padding: mobile ? "10px" : "20px",
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}
