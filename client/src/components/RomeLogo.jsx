
export default function RomeLogo({ size = 'md' }) {
  const containerClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-10 h-10 rounded-xl'
  };

  const svgClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  return (
    <div className={`${containerClasses[size] || containerClasses.md} bg-black border border-white/10 flex items-center justify-center text-white shadow-md`}>
      <svg 
        viewBox="0 0 100 100" 
        className={svgClasses[size] || svgClasses.md} 
        fill="currentColor"
      >
        {/* Book Outline Frame */}
        <path d="M 33 23 h 34 v 49 h -34 v -10 h 5 v 5 h 24 v -39 h -24 v 15 h -5 z" />
        
        {/* Bookmark Ribbon */}
        <path d="M 33 72 h 5 v 10 l -2.5 -3 l -2.5 3 z" />
        
        {/* Bold Letter 'B' with filled loops and cutouts */}
        <path 
          fillRule="evenodd" 
          d="M 33 45 H 42 C 45 45, 47 47, 47 50 C 47 51.5, 45.5 52.2, 44 52.5 C 46 52.8, 48 54, 48 56.5 C 48 59, 45.5 60, 42 60 H 33 Z M 38 48.5 H 41 C 42.2 48.5, 43 49, 43 50.2 C 43 51, 42.2 51.5, 41 51.5 H 38 Z M 38 54 H 42 C 43.2 54, 44 54.5, 44 56 C 44 57.2, 43.2 58, 42 58 H 38 Z" 
        />
      </svg>
    </div>
  );
}
