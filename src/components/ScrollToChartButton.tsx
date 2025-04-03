const ScrollToChartButton = () => {
  // グラフ部分までスクロール
  const scrollToChart = () => {
    const chartElement = document.getElementById('population-chart');
    if (chartElement) {
      chartElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToChart}
      className={`
        fixed bottom-6 right-6 z-50
        bg-blue-500 hover:bg-blue-600 text-white
        rounded-full p-3 shadow-lg
        flex items-center justify-center
        transition-all duration-300
      `}
      aria-label="グラフを見る"
    >
      <span className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        グラフを見る
      </span>
    </button>
  );
};

export default ScrollToChartButton;