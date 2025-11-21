import { motion } from "framer-motion";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const BRAND = "#07518a";

export default function SolarLanding({ onRegister }) {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center bg-white"
      style={{ height: "80vh" }}
    >
      {/* Logo */}
      <motion.img
        src="https://www.brihaspathi.com/highbtlogo%20tm%20(1).png"
        alt="Brihaspathi Technologies Logo"
        className="w-80 md:w-48 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
        style={{ color: BRAND }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Solar Trainee Entrepreneur Program
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="max-w-2xl text-gray-700 text-lg md:text-xl mb-8 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Join{" "}
        <span className="font-semibold text-[#07518a]">
          Brihaspathi Technologies Limited
        </span>{" "}
        — a pioneer in IoT, AI, and Renewable Energy — to empower yourself in
        the solar revolution.
      </motion.p>

      {/* Ant Design Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <Button
          type="default"
          size="large"
          onClick={onRegister}
          style={{
            color: "white",
            backgroundColor: "black",
            borderRadius: "50px",
            padding: "0 28px",
            height: "48px",
            fontWeight: "600",
          }}
          icon={<ArrowRightOutlined style={{ fontSize: "18px" }} />}
        >
          Register Now
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-6 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Powered by{" "}
        <a
          href="https://www.brihaspathi.com"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[#07518a] hover:underline"
        >
          www.brihaspathi.com
        </a>
      </motion.div>
    </section>
  );
}
