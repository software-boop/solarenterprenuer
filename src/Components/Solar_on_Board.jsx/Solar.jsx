
import { useState } from "react";
import SolarLanding from "./SolarLanding";
import SolarForm from "./SolarForm";
import SolarSuccess from "./SolarSuccess";  




export default function Solar() {
  const [step, setStep] = useState("landing"); // landing | form | success

  return (
    <>
      {step === "landing" && <SolarLanding onRegister={() => setStep("form")} />}
      {step === "form" && <SolarForm onSuccess={() => setStep("success")} />}
      {step === "success" && <SolarSuccess onRestart={() => setStep("landing")} />}
    </>
  );
}
