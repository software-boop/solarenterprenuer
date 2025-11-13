import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Progress,
} from "antd";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

// =====================
// 🎨 Brand Identity
// =====================
const BRAND_PRIMARY = "#0A4D8C";
const BRAND_GRADIENT = "linear-gradient(135deg, #0A4D8C 0%, #063A6E 100%)";
const BORDER_COLOR = "#E5E7EB";
const TEXT_SUB = "#6B7280";

const { Title, Text } = Typography;
const { Option } = Select;

// =====================
// 🖼️ Logos
// =====================
import solarlogo from "../../assets/images/MNRE_India1(1).png";
import solarlogo_1 from "../../assets/images/Niesbud-High-Resolution-Logo(1).png";
import solarlogo_2 from "../../assets/images/REC_logo.svg (1) (1).png";
import solarlogo_3 from "../../assets/images/Skill-India(1).webp";

// =====================
// 📍 Data
// =====================
const states = ["Andhra Pradesh", "Telangana"];

const districtsAP = [
  "Alluri Sitarama Raju", "Anakapalli", "Anantapur", "Annamayya", "Bapatla",
  "Chittoor", "East Godavari", "Eluru", "Guntur", "Kakinada", "Konaseema",
  "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam",
  "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam",
  "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
];

const districtsTS = [
  "Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial",
  "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy",
  "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad",
  "Mahabubnagar", "Mancherial", "Medak", "Medchal–Malkajgiri", "Mulugu",
  "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
  "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet",
  "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhongir"
];

// =====================
// ⚙️ Component
// =====================
export default function SolarForm({ onSuccess }) {
  const [form] = Form.useForm();
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // --------------------------------------
  // 🧭 Geolocation
  // --------------------------------------
  const getUserLocation = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        toast.error("Your browser doesn’t support geolocation.");
        resolve({ latitude: null, longitude: null });
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }),
          () => {
            toast.error("Unable to fetch your location.");
            resolve({ latitude: null, longitude: null });
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    });

  // --------------------------------------
  // 🚀 Submit Handler
  // --------------------------------------
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const loc = await getUserLocation();
      const payload = {
        ...values,
        mobile: values.mobile.trim(),
        latitude: loc.latitude,
        longitude: loc.longitude,
      };
      const res = await axios.post(
        "https://register-backend-1-ir0a.onrender.com/api/entrepreneur/register",
        payload
      );
      toast.success(res.data.message || "Registration successful 🎉");
      form.resetFields();
      setProgress(0);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------
  // 🧮 Progress Calculation
  // --------------------------------------
  const onFormChange = (_, allValues) => {
    const filled = Object.values(allValues).filter(Boolean).length;
    setProgress((filled / 7) * 100);
  };

  // --------------------------------------
  // 🎨 UI (Full Height 100vh)
  // --------------------------------------
  return (
    <>
      <Toaster position="top-right" />

      <div
        className="flex flex-col lg:flex-row"
        style={{
          height: "100vh", // 🔹 Full viewport height
          overflow: "hidden",
        }}
      >
        {/* LEFT PANEL */}
        <motion.div
          className="lg:w-1/2 w-full flex items-center justify-center bg-gray-50"
          style={{
            height: "100vh",
            overflowY: "auto",
          }}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            bordered={false}
            className="w-full max-w-2xl shadow-xl"
            style={{
              borderRadius: 20,
              backgroundColor: "white",
              margin: "auto",
            }}
          >
            {/* Logos */}
            <div className="text-center py-6 border-b border-gray-200">
              <Space wrap align="center" className="justify-center gap-6">
                {[solarlogo, solarlogo_1, solarlogo_2, solarlogo_3].map(
                  (logo, i) => (
                    <motion.img
                      key={i}
                      src={logo}
                      alt="Partner Logo"
                      className="h-14 w-auto opacity-90"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                    />
                  )
                )}
              </Space>
            </div>

            {/* Header */}
           

            {/* Form */}
            <div className="px-6 pb-8">
              <Progress
                percent={Math.round(progress)}
                showInfo={false}
                strokeColor={BRAND_PRIMARY}
                strokeWidth={6}
                style={{ marginBottom: 20 }}
              />

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onValuesChange={onFormChange}
                size="large"
              >
                <Row gutter={20}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="fullname"
                      label="Full Name"
                      rules={[{ required: true, message: "Enter your full name" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="John Doe"
                        style={{
                          borderRadius: 10,
                          border: `1px solid ${BORDER_COLOR}`,
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Enter your email" },
                        { type: "email", message: "Invalid email" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="you@example.com"
                        style={{
                          borderRadius: 10,
                          border: `1px solid ${BORDER_COLOR}`,
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={20}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="mobile"
                      label="Mobile Number"
                      rules={[
                        { required: true, message: "Enter your mobile number" },
                        {
                          pattern: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10-digit number",
                        },
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        addonBefore="+91"
                        placeholder="9876543210"
                        maxLength={10}
                        style={{
                          borderRadius: 10,
                          border: `1px solid ${BORDER_COLOR}`,
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="pincode"
                      label="Pincode"
                      rules={[
                        { required: true, message: "Enter your pincode" },
                        { pattern: /^\d{6}$/, message: "Enter a valid 6-digit pincode" },
                      ]}
                    >
                      <Input
                        prefix={<GlobalOutlined />}
                        placeholder="500001"
                        style={{
                          borderRadius: 10,
                          border: `1px solid ${BORDER_COLOR}`,
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={20}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="state"
                      label="State"
                      rules={[{ required: true, message: "Select your state" }]}
                    >
                      <Select
                        placeholder="Select State"
                        onChange={setSelectedState}
                        style={{ borderRadius: 10 }}
                      >
                        {states.map((s) => (
                          <Option key={s} value={s}>
                            {s}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="district"
                      label="District"
                      rules={[{ required: true, message: "Select your district" }]}
                    >
                      <Select
                        placeholder="Select District"
                        disabled={!selectedState}
                        style={{ borderRadius: 10 }}
                      >
                        {(selectedState === "Andhra Pradesh"
                          ? districtsAP
                          : districtsTS
                        ).map((d) => (
                          <Option key={d} value={d}>
                            {d}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="city"
                  label="City / Town"
                  rules={[{ required: true, message: "Enter your city" }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Hyderabad"
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${BORDER_COLOR}`,
                    }}
                  />
                </Form.Item>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    style={{
                      height: 52,
                      borderRadius: 12,
                      background: BRAND_GRADIENT,
                      fontWeight: 600,
                      fontSize: 16,
                      border: "none",
                      boxShadow: "0 4px 15px rgba(10,77,140,0.3)",
                    }}
                  >
                    {loading ? "Submitting..." : "Complete Registration"}
                  </Button>
                </motion.div>

                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 14,
                    fontSize: 13,
                    color: TEXT_SUB,
                  }}
                >
                  📍 Your location will be captured automatically for verification.
                </Text>
              </Form>
            </div>
          </Card>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          className="lg:w-1/2 hidden lg:flex flex-col justify-center items-center text-white relative overflow-hidden"
          style={{
            height: "100vh",
            background: BRAND_GRADIENT,
          }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

 <div className="text-center px-6 py-6 bg-white mb-24 rounded-2xl">
              <Title level={3} style={{ color: BRAND_PRIMARY, fontWeight: 700 }}>
                Solar Entrepreneur Onboarding
              </Title>
              <Text style={{ color: TEXT_SUB, fontSize: 15 }}>
                Join the National Solar Mission and shape India’s renewable future.
              </Text>
            </div>

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 text-center max-w-md px-6">
            <img
              src="https://www.brihaspathi.com/highbtlogo%20white-%20tm.png"
              alt="Brihaspathi Logo"
              className="w-40 mx-auto mb-6"
            />
            <Title level={1} style={{ color: "white", fontWeight: 700 }}>
              Power the Future
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 17 }}>
              Become part of India’s solar revolution. Learn, certify, and grow
              with the government-backed Solar Entrepreneurship Program.
            </Text>
          </div>
        </motion.div>
      </div>
    </>
  );
}
