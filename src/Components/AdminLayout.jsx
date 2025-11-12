import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Button,
  Menu,
  Layout,
  Avatar,
  Badge,
  Tooltip,
  Dropdown,
  Drawer,
} from "antd";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import B_white from "../../src/assets/Logos/only B logo white (1).png";
import B_blues from "../../src/assets/Logos/only B logo (1).png";

const { Header, Sider, Content } = Layout;

/* ===== Theme Colors ===== */
const BRAND_PRIMARY = "#10b981"; // emerald-500
const BRAND_SECONDARY = "#34d399"; // emerald-400
const BG_LIGHT = "#f0fdf4";
const TEXT_DARK = "#1f2937";
const WHITE = "#ffffff";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ================================
     📱 Responsive Sidebar Handling
  ================================= */
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

  /* ================================
     🔥 Active Menu Highlight Logic
  ================================= */
  const getSelectedKey = () => {
    const path = location.pathname;

    if (path === "/admin" || path === "/admin/") return "1";
    if (path.includes("/admin/aprove")) return "2";
    if (path.includes("/admin/records")) return "3";
    if (path.includes("/admin/manage-cordinator")) return "4";
    return "1";
  };

  /* ================================
     📊 Menu Items
  ================================= */
  const menuItems = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "2",
      icon: <PieChartOutlined />,
      label: "Approve & Reject",
      onClick: () => navigate("/admin/aprove"),
    },
    {
      key: "3",
      icon: <DesktopOutlined />,
      label: "Create Coordinators",
      onClick: () => navigate("/admin/records"),
    },
    {
      key: "4",
      icon: <AppstoreOutlined />,
      label: "Manage Coordinators",
      onClick: () => navigate("/admin/manage-cordinator"),
    },
  ];

  /* ================================
     🔔 Notification Dropdown (Optional)
  ================================= */
  const notificationMenu = (
    <Menu
      items={[
        { key: "1", label: "New registration approved ✅" },
        { key: "2", label: "5 pending applications 🕓" },
      ]}
      style={{
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    />
  );

  /* ================================
     🧭 Sidebar Content
  ================================= */
  const SidebarContent = (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Sidebar Header */}
      <div
        style={{
          background: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_SECONDARY})`,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Avatar
          shape="square"
          size={collapsed ? 36 : 48}
          src={collapsed ? B_blues : "https://www.brihaspathi.com/highbtlogo%20tm%20(1).png"}
          style={{
            transition: "all 0.3s ease",
            height: collapsed ? "15px" : "40px",
            width: collapsed ? "15px" : "auto",
            background: "transparent",
          }}
        />
        {!mobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: WHITE,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 6,
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
          flex: 1,
          border: "none",
          padding: "12px 8px",
          fontWeight: 500,
          fontSize: "15px",
        }}
        className="custom-menu"
      />
    </div>
  );

  /* ================================
     🏗️ Layout Structure
  ================================= */
  return (
    <Layout style={{ minHeight: "100vh", background: BG_LIGHT }}>
      {/* Sidebar (Desktop) */}
      {!mobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={240}
          collapsedWidth={70}
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            background: WHITE,
            borderRight: "1px solid #d1fae5",
            zIndex: 100,
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          }}
        >
          {SidebarContent}
        </Sider>
      )}

      {/* Drawer (Mobile) */}
      {mobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          bodyStyle={{ padding: 0, background: WHITE }}
          width={220}
          style={{ zIndex: 3000 }}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: !mobile ? (collapsed ? 70 : 240) : 0,
          transition: "margin 0.3s ease",
          background: WHITE,
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Header
          style={{
            position: "fixed",
            top: 0,
            left: !mobile ? (collapsed ? 70 : 240) : 0,
            right: 0,
            height: 64,
            background: WHITE,
            borderBottom: "1px solid #d1fae5",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 2000,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Left: Menu + Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {mobile && (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ color: BRAND_PRIMARY, fontSize: 22 }}
              />
            )}
            {/* <img
              src={B_white}
              alt="Solar Logo"
              style={{
                height: 38,
                objectFit: "contain",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
              }}
            /> */}
            {!mobile && (
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: BRAND_PRIMARY,
                  letterSpacing: "-0.5px",
                }}
              >
                Solar Energy Dashboard
              </h2>
            )}
          </div>

          {/* Right: Notifications + Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Dropdown
              overlay={notificationMenu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Tooltip title="Notifications">
                <Badge
                  count={3}
                  size="small"
                  style={{ backgroundColor: BRAND_PRIMARY }}
                >
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{ color: BRAND_PRIMARY, fontSize: 19 }}
                  />
                </Badge>
              </Tooltip>
            </Dropdown>

            <Tooltip title="Logout">
              <Button
                type="text"
                icon={<LogoutOutlined />}
                style={{
                  color: "#ef4444",
                  fontSize: 18,
                  borderRadius: 6,
                  background: "rgba(239,68,68,0.05)",
                }}
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              />
            </Tooltip>
          </div>
        </Header>

        {/* Page Content */}
        <Content
          style={{
            marginTop: 120,
            padding: mobile ? "16px" : "28px",
            minHeight: "calc(100vh - 64px)",
            background: WHITE,
            borderRadius: mobile ? 0 : 12,
            margin: mobile ? 0 : "16px",
            boxShadow: mobile ? "none" : "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}
