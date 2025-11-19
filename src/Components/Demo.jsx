import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Typography } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { BackgroundBeamsWithCollision } from "./BackgroundBeamsWithCollision";

import solarlogo from "../assets/images/MNRE_India1(1).png";
import solarlogo_1 from "../assets/images/Niesbud-High-Resolution-Logo(1).png";
import solarlogo_2 from "../assets/images/REC_logo.svg (1) (1).png";
import solarlogo_3 from "../assets/images/Skill-India(1).webp";
import mainweb_logo from "../assets/images/highbtlogo white- tm.png";
import background_image from "../assets/images/renewable-power-generation-through-hybrid-energy-farm-with-wind-turbines-solar-panels-concept-renewable-energy-power-generation-hybrid-energy-farm-wind-turbines-solar-panels.jpg";

const { Title, Paragraph } = Typography;

const Demo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${background_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 "></div>

      <BackgroundBeamsWithCollision className="relative z-20 w-full px-4 sm:px-8 py-6 sm:py-10">
        <div className="text-center mx-auto w-full max-w-4xl">

          {/* 🔹 Partner Logos */}
          <Row gutter={[12, 12]} justify="center" className="mb-6 sm:mb-10">
            {[solarlogo, solarlogo_1, solarlogo_2, solarlogo_3].map((logo, i) => (
              <Col xs={6} sm={6} md={6} lg={6} key={i}>
                <Card
                  hoverable
                  style={{
                    borderRadius: "10px",
                    padding: "6px",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  bodyStyle={{ padding: 6 }}
                >
                  <img
                    src={logo}
                    alt={`logo-${i}`}
                    className="object-contain"
                    style={{ width: "100%", maxHeight: "45px" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* 🔸 Main Logo */}
          <img
            src={mainweb_logo}
            alt="Main Logo"
            className="mx-auto mb-4 sm:mb-6"
            style={{
              width: "60px",
              height: "auto",
            }}
          />

          {/* 🔻 Headline */}
          <Title
            level={2}
            style={{
              color: "white",
              fontSize: "1.8rem",
              lineHeight: 1.3,
              textShadow: "2px 2px 5px rgba(0,0,0,0.6)",
            }}
            className="sm:text-4xl md:text-5xl"
          >
            Power the Future
          </Title>

          {/* 🌍 Subtext */}
          <Paragraph
            style={{
              color: "#e0e0e0",
              fontSize: "0.95rem",
              lineHeight: 1.5,
              maxWidth: "650px",
              margin: "auto",
              marginBottom: "20px",
            }}
            className="sm:text-lg"
          >
            Join India’s clean-energy revolution. Upskill, earn certifications,
            and grow with the{" "}
            <span style={{ color: "#ffa940", fontWeight: "600" }}>
              Solar Entrepreneurship Program
            </span>.
          </Paragraph>

          {/* 🔘 Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4">
            <Button
              type="primary"
              icon={<LoginOutlined />}
              size="large"
              block={window.innerWidth < 640}
              onClick={() => navigate("/login?type=admin")}
            >
              Admin Login
            </Button>

            <Button
              type="default"
              icon={<TeamOutlined />}
              size="large"
              block={window.innerWidth < 640}
              onClick={() => navigate("/login?type=coordinator")}
            >
              Coordinator Login
            </Button>

            <Button
              type="dashed"
              icon={<UserAddOutlined />}
              size="large"
              block={window.innerWidth < 640}
              onClick={() => navigate("/registration")}
            >
              Register Now
            </Button>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default Demo;
