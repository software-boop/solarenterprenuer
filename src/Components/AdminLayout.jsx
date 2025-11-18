import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  BellOutlined,
  UserOutlined,
  CheckCircleOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import {
  Button,
  Menu,
  Layout,

  Tooltip,
  Dropdown,
  Drawer,
} from "antd";

import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

// Logos
import B_white from "../../src/assets/Logos/only B logo white (1).png";
import B_blues from "../../src/assets/Logos/only B logo (1).png";

const { Header, Sider, Content } = Layout;

/* ============================================
   🌈 Modern Theme Colors
============================================ */
const BRAND = {
  primary: "#10b981",
  secondary: "#34d399",
  lightBg: "#f0fdf4",
  white: "#ffffff",
  textDark: "#1f2937",
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ============================================
     📱 Responsive Handling
  ============================================= */
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

  /* ============================================
     🔥 Active Menu Logic
  ============================================= */
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") return "1";
    if (path.includes("/admin/aprove")) return "2";
    if (path.includes("/admin/records")) return "3";
    if (path.includes("/admin/manage-cordinator")) return "4";
    return "1";
  };

  /* ============================================
     🧭 Menu Items
  ============================================= */
  const menuItems = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "2",
      icon: <CheckCircleOutlined />,
      label: "Approve & Reject",
      onClick: () => navigate("/admin/aprove"),
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: "Create Coordinators",
      onClick: () => navigate("/admin/records"),
    },
    {
      key: "4",
      icon: <UsergroupAddOutlined />,
      label: "Manage Coordinators",
      onClick: () => navigate("/admin/manage-cordinator"),
    },
  ];

  /* ============================================
     🔔 Notification Dropdown
  ============================================= */
  const notificationMenu = (
    <Menu
      items={[
        { key: "1", label: "New Registration Approved" },
        { key: "2", label: "5 Pending Applications" },
      ]}
      style={{
        borderRadius: 10,
        padding: 6,
      }}
    />
  );

  /* ============================================
     🧱 Sidebar Component
  ============================================= */
  const SidebarContent = (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          transition={{ duration: 0.5 }}
          src={
            mobile
              ? B_white
              : collapsed
              ? B_blues
              : "https://www.brihaspathi.com/highbtlogo%20tm%20(1).png"
          }
          alt="BTL Logo"
          style={{
            height: collapsed ? "30px" : "42px",
            objectFit: "contain",
            transition: "all 0.3s ease",
          }}
        />

        {!mobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: BRAND.white,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 8,
            }}
          />
        )}
      </div>

      {/* Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{
          padding: "16px 10px",
          fontWeight: 500,
          fontSize: "15px",
        }}
      />
    </div>
  );

  /* ============================================
     🌟 Layout Structure
  ============================================= */
  return (
    <Layout style={{ minHeight: "100vh", background: BRAND.lightBg }}>
      {/* ===== Desktop Sidebar ===== */}
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
            
            borderRight: "1px solid #d1fae5",
            boxShadow: "2px 0 10px rgba(0,0,0,0.06)",
          }}
        >
          {SidebarContent}
        </Sider>
      )}

      {/* ===== Mobile Drawer ===== */}
      {mobile && (
        <Drawer
          placement="left"
          closable={false}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          bodyStyle={{ padding: 0 }}
          width={240}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* ===== Main Page Layout ===== */}
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
            borderBottom: "1px solid #d1fae5",
            position: "fixed",
            top: 0,
            left: !mobile ? (collapsed ? 70 : 250) : 0,
            right: 0,
            zIndex: 2000,
            transition: "0.3s ease",
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
    // Responsive font size
    // min 1.1rem (small phones), preferred 2.2vw, max 1.8rem (large screens)
    fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)",
    color: BRAND.primary,
    letterSpacing: "-0.03em",
    whiteSpace: "nowrap",     // prevents awkward wrapping on mid screens
    overflow: "hidden",
    textOverflow: "ellipsis", // if space is too small, it gracefully trims
  }}
>
  Admin
</h1>

          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
           

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
          </div>
        </Header>

        {/* Content */}
        <Content
style={{
  marginTop: 30,
  padding: mobile ? "10px" : "20px",
  minHeight: "100vh",
  backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
}}


        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}
