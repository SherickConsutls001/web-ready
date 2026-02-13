export default function SkillBridgeLogo({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bridge Structure */}
      <g>
        {/* Left pillar - Blue */}
        <rect x="15" y="40" width="8" height="35" fill="#002395" rx="2"/>
        
        {/* Right pillar - Blue */}
        <rect x="77" y="40" width="8" height="35" fill="#002395" rx="2"/>
        
        {/* Bridge arch - Green with gradient */}
        <defs>
          <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#007749"/>
            <stop offset="50%" stopColor="#FFB81C"/>
            <stop offset="100%" stopColor="#007749"/>
          </linearGradient>
        </defs>
        
        {/* Main bridge curve */}
        <path 
          d="M 19 40 Q 50 20, 81 40" 
          stroke="url(#bridgeGradient)" 
          strokeWidth="6" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Bridge deck */}
        <rect x="15" y="38" width="70" height="4" fill="#002395" rx="1"/>
        
        {/* Connection lines (cables) */}
        <line x1="25" y1="40" x2="35" y2="32" stroke="#FFB81C" strokeWidth="1.5" opacity="0.8"/>
        <line x1="35" y1="40" x2="45" y2="28" stroke="#FFB81C" strokeWidth="1.5" opacity="0.8"/>
        <line x1="55" y1="28" x2="65" y2="40" stroke="#FFB81C" strokeWidth="1.5" opacity="0.8"/>
        <line x1="65" y1="32" x2="75" y2="40" stroke="#FFB81C" strokeWidth="1.5" opacity="0.8"/>
      </g>
      
      {/* Connecting dots representing talent/opportunities */}
      <circle cx="50" cy="24" r="3.5" fill="#E03C31"/>
      <circle cx="30" cy="50" r="2.5" fill="#007749" opacity="0.7"/>
      <circle cx="70" cy="50" r="2.5" fill="#007749" opacity="0.7"/>
      
      {/* Letter S integrated into design */}
      <path 
        d="M 45 65 Q 40 60, 45 55 Q 50 50, 45 45" 
        stroke="#002395" 
        strokeWidth="3" 
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SkillBridgeLogoFull({ className = "" }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <SkillBridgeLogo className="w-10 h-10" />
      <span className="text-2xl font-bold font-outfit text-slate-900">SkillBridge</span>
    </div>
  );
}
