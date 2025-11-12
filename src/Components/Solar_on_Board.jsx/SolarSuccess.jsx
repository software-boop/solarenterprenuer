import { motion } from "framer-motion";
import { Button } from "antd";
import { ArrowRightOutlined, CheckCircleFilled } from "@ant-design/icons";

const BRAND = "#07518a";
const LOGO = "https://www.brihaspathi.com/highbtlogo%20tm%20(1).png";

export default function SolarSuccess({ onRestart }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Brand Logo */}
      <motion.img
        src={LOGO}
        alt="Brihaspathi"
        className="w-40 md:w-48 mb-4"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Success Heading */}
      <div className="flex items-center gap-2 mb-2">
        <CheckCircleFilled style={{ color: "#16a34a", fontSize: 24 }} />
        <h2 className="text-3xl md:text-4xl font-bold" style={{ color: BRAND }}>
          Thank You for Registering!
        </h2>
      </div>

      <p className="text-gray-600 max-w-xl mb-8">
        We’ve received your registration successfully. Our team will get in touch with you shortly.
      </p>

      {/* Highlight Section */}
      <motion.section
        className="w-full max-w-3xl py-8 px-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm mb-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: BRAND }}>
          Let’s Collaborate and Innovate
        </h3>
        <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed">
          At <span className="font-semibold text-gray-800">Brihaspathi Technologies Limited</span>, we’ve been driving innovation for over a decade—
          empowering businesses, government agencies, and institutions with secure, scalable, and intelligent technology solutions.
        </p>
      </motion.section>

      {/* Ant Design Button (brand background, white text, right arrow) */}
      <Button
        type="default"
        size="large"
        onClick={onRestart}
        icon={<ArrowRightOutlined />}
        style={{
          backgroundColor: BRAND,
          color: "#ffffff",
          border: "none",
          padding: "0 28px",
          height: 48,
          borderRadius: 9999,
          fontWeight: 600,
        }}
      >
        Register Another Entrepreneur
      </Button>

      {/* Optional: footer link */}
      <div className="mt-8 text-sm text-gray-500">
        Powered by{" "}
        <a
          href="https://www.brihaspathi.com"
          target="_blank"
          rel="noreferrer"
          className="font-semibold"
          style={{ color: BRAND }}
        >
          www.brihaspathi.com
        </a>
      </div>
    </motion.div>
  );
}
