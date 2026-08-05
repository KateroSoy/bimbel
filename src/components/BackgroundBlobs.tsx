export function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <svg
        className="absolute top-0 right-0 w-[600px] h-[600px] text-blue-400/20 blur-[120px] animate-blob mix-blend-multiply"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.1,-0.5C88.1,15.3,83.5,30.6,74.5,43.3C65.5,56,52.1,66.2,37.3,73.6C22.6,81,6.5,85.6,-8.7,85.1C-23.9,84.6,-38.2,79.1,-52.1,71.5C-66,63.9,-79.5,54.2,-86.4,40.7C-93.3,27.2,-93.6,9.8,-88.9,-5.3C-84.3,-20.4,-74.7,-33.2,-63.3,-43.3C-51.9,-53.4,-38.7,-60.8,-25.7,-68.8C-12.7,-76.8,-0.1,-85.4,13.7,-85.2C27.5,-85,41.4,-76,44.7,-76.4Z"
          transform="translate(100 100)"
        />
      </svg>

      <svg
        className="absolute top-40 -left-20 w-[500px] h-[500px] text-cyan-300/20 blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M47.7,-68.8C59.2,-58.5,64.2,-40.3,67,-23.4C69.7,-6.4,70.1,9.4,63.3,21.5C56.6,33.5,42.8,41.9,29.3,50.1C15.8,58.3,2.6,66.4,-11.2,68.9C-25.1,71.5,-39.6,68.6,-51.7,59.9C-63.8,51.3,-73.4,36.8,-76.3,21C-79.3,5.3,-75.5,-11.8,-67.2,-25.1C-58.8,-38.4,-45.8,-47.9,-32.7,-57.4C-19.6,-66.8,-6.4,-76.2,6.4,-77.3C19.3,-78.4,36.2,-79.1,47.7,-68.8Z"
          transform="translate(100 100)"
        />
      </svg>

      <svg
        className="absolute -bottom-32 left-1/2 w-[800px] h-[800px] text-blue-300/20 blur-[150px] animate-blob animation-delay-4000 mix-blend-multiply"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M39.9,-54.6C54.4,-44.6,70.9,-35.1,77.5,-21.4C84.2,-7.7,81,10.2,72.4,24.8C63.8,39.5,49.8,50.8,34.6,58C19.4,65.1,3,68.1,-12.3,66.5C-27.7,64.9,-42,58.6,-54.1,48.4C-66.2,38.2,-76.1,24.1,-79.5,8.5C-82.9,-7.1,-79.8,-24.1,-69.5,-35.3C-59.3,-46.5,-41.8,-51.9,-27.1,-61C-12.4,-70.1,0.1,-82.9,10.6,-80.4C21,-77.9,31.5,-64.7,39.9,-54.6Z"
          transform="translate(100 100)"
        />
      </svg>
    </div>
  );
}
