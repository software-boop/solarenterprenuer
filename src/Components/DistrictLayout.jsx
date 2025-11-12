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

const SOLAR_PRIMARY = "#f97316";
const SOLAR_SECONDARY = "#fb923c";
const LIGHT_GRAY = "#f9fafb";
const TEXT_COLOR = "#222";

export default function DistrictLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Detect screen width for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 992);
      if (window.innerWidth > 992) setDrawerOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Highlight active tab
  const selectedKey = location.pathname.includes("records") ? "2" : "1";

  const items = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/district-coordinator"),
    },
     {
      key: "2",
      icon: <PieChartOutlined />,
      label: "Aprovals",
      onClick: () => navigate("aprovals"),
    },
   
  ];

  const notificationMenu = (
    <Menu
      items={[
        { key: "1", label: "New registration approved" },
        // { key: "2", label: "5 pending applications" },
        // { key: "3", label: "Server maintenance at 11 PM" },
      ]}
    />
  );

  const SidebarContent = (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* === Sidebar Header === */}
      <div
        style={{
          background: `linear-gradient(90deg, ${SOLAR_PRIMARY}, ${SOLAR_SECONDARY})`,
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
            style={{ color: "#fff", background: "transparent", fontSize: 18 }}
          />
        )}
      </div>

      {/* === Sidebar Menu === */}
      <Menu
        theme="light"
        mode="inline"
        inlineCollapsed={collapsed && !mobile}
        selectedKeys={[selectedKey]}
        items={items}
        style={{
          background: "transparent",
          color: TEXT_COLOR,
          fontWeight: 500,
          borderRight: "none",
          padding: "0 8px",
          flex: 1,
        }}
      />
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: LIGHT_GRAY }}>
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
            background: "#fff",
            borderRight: "1px solid #e5e7eb",
            zIndex: 100,
          }}
        >
          {SidebarContent}
        </Sider>
      )}

      {mobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          bodyStyle={{ padding: 0, background: "#fff" }}
          width={220}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* ===== Main Area ===== */}
      <Layout
        style={{
          marginLeft: !mobile ? (collapsed ? 70 : 240) : 0,
          transition: "all 0.3s ease",
          background: "#fff",
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
            background: "#fff",
            borderBottom: "1px solid #f1f5f9",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 2000,
          }}
        >
          {/* Left: mobile menu + logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {mobile && (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ color: SOLAR_PRIMARY, fontSize: 20 }}
              />
            )}
            <img
              src="https://www.brihaspathi.com/highbtlogo%20tm%20(1).png"
              alt="BTPL Logo"
              style={{ height: 36, objectFit: "contain" }}
            />
            {!mobile && (
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: SOLAR_PRIMARY,
                }}
              >
                Solar Energy Dashboard
              </h2>
            )}
          </div>

          {/* Right: notifications + avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Dropdown overlay={notificationMenu} trigger={["click"]}>
              <Tooltip title="Notifications">
                <Badge count={3} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{ color: SOLAR_PRIMARY, fontSize: 18 }}
                  />
                </Badge>
              </Tooltip>
            </Dropdown>

            <Avatar
              size={36}
              src="https://www.brihaspathi.com/highbtlogo%20tm%20(1).png"
              style={{ border: `2px solid ${SOLAR_PRIMARY}` }}
            />
          </div>
        </Header>

        {/* ===== Page Content ===== */}
        <Content
          style={{
            marginTop: 64,
            padding: mobile ? 16 : 24,
            minHeight: "calc(100vh - 64px)",
            background: "#fff",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}
