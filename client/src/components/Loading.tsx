import { OrbitProgress } from "react-loading-indicators";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <OrbitProgress variant="track-disc" color="#1C398E" size="medium" />
    </div>
  );
};

export default Loading;
