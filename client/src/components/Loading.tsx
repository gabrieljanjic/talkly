import { OrbitProgress } from "react-loading-indicators";

const Loading = () => {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      data-testid="loading-spinner"
    >
      <OrbitProgress variant="track-disc" color="#00BC7D" size="small" />
    </div>
  );
};

export default Loading;
