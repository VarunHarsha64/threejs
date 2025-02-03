import MapScene from "./components/MapScene";

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen">
      <MapScene />
      <button className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md">
        Button
      </button>
    </div>
  );
};

export default App;
