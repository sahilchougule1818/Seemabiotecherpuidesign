import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ERPLayout } from "./components/layout/ERPLayout";
import { AppContextProvider } from "./context/AppContext";
import { Dashboard } from "./pages/Dashboard";
import { MediaPreparation } from "./pages/indoor/MediaPreparation";
import { Subculturing } from "./pages/indoor/Subculturing";
import { Incubation } from "./pages/indoor/Incubation";
import { Sampling } from "./pages/indoor/Sampling";
import { PrimaryHardening } from "./pages/outdoor/PrimaryHardening";
import { SecondaryHardening } from "./pages/outdoor/SecondaryHardening";
import { Mortality } from "./pages/outdoor/Mortality";
import { HoldingArea } from "./pages/outdoor/HoldingArea";
import { OutdoorSampling } from "./pages/outdoor/OutdoorSampling";
import "./styles/globals.css";

export default function App() {
  return (
    <AppContextProvider>
      <Router>
        <ERPLayout>
          <Routes>
          {/* Default route - redirect to first indoor page */}
          <Route path="/" element={<Navigate to="/indoor/media-preparation" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Indoor Module Routes */}
          <Route path="/indoor/media-preparation" element={<MediaPreparation />} />
          <Route path="/indoor/subculturing" element={<Subculturing />} />
          <Route path="/indoor/incubation" element={<Incubation />} />
          <Route path="/indoor/sampling" element={<Sampling />} />
          
          {/* Outdoor Module Routes */}
          <Route path="/outdoor/primary-hardening" element={<PrimaryHardening />} />
          <Route path="/outdoor/secondary-hardening" element={<SecondaryHardening />} />
          <Route path="/outdoor/mortality" element={<Mortality />} />
          <Route path="/outdoor/holding-area" element={<HoldingArea />} />
          <Route path="/outdoor/sampling" element={<OutdoorSampling />} />
          
          {/* Catch all route - redirect to media preparation */}
          <Route path="*" element={<Navigate to="/indoor/media-preparation" replace />} />
          </Routes>
        </ERPLayout>
      </Router>
    </AppContextProvider>
  );
}
