import { useState } from "react";
import HeroPage from "./components/HeroPage";
import LayoutPicker from "./components/LayoutPicker";
import CameraBooth from "./components/CameraBooth";
import StripEditor from "./components/StripEditor";

const STEPS = { hero: "hero", layout: "layout", camera: "camera", editor: "editor" };

export default function App() {
  const [step, setStep] = useState(STEPS.hero);
  const [layout, setLayout] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState("filter-none");

  const handleLayoutSelect = (l) => {
    setLayout(l);
    setStep(STEPS.camera);
  };

  const handlePhotosDone = (imgs, f) => {
    setPhotos(imgs);
    setFilter(f);
    setStep(STEPS.editor);
  };

  const restart = () => {
    setStep(STEPS.hero);
    setLayout(null);
    setPhotos([]);
    setFilter("filter-none");
  };

  return (
    <>
      {step === STEPS.hero && <HeroPage onStart={() => setStep(STEPS.layout)} />}
      {step === STEPS.layout && <LayoutPicker onSelect={handleLayoutSelect} />}
      {step === STEPS.camera && layout && (
        <CameraBooth layout={layout} onDone={handlePhotosDone} />
      )}
      {step === STEPS.editor && (
        <StripEditor
          photos={photos}
          layout={layout}
          filter={filter}
          onBack={() => setStep(STEPS.camera)}
          onRestart={restart}
        />
      )}
    </>
  );
}
