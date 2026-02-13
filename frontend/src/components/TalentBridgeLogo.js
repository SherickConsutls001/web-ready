export default function TalentBridgeLogo({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradient for bridge */}
        <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#007749"/>
          <stop offset="50%" stopColor="#FFB81C"/>
          <stop offset="100%" stopColor="#002395"/>
        </linearGradient>
        
        {/* Gradient for circle */}
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#002395"/>
          <stop offset="100%" stopColor="#007749"/>
        </linearGradient>
      </defs>
      
      {/* Outer circle - represents global reach */}
      <circle cx="60" cy="60" r="54" stroke="url(#circleGradient)" strokeWidth="3" fill="none" opacity="0.2"/>
      
      {/* Bridge structure - modern and sleek */}
      <g>
        {/* Left tower */}
        <rect x="25" y="45" width="6" height="40" fill="#002395" rx="3"/>
        
        {/* Right tower */}
        <rect x="89" y="45" width="6" height="40" fill="#002395" rx="3"/>
        
        {/* Suspension cables - curved */}
        <path 
          d="M 31 45 Q 60 25, 89 45" 
          stroke="url(#bridgeGradient)" 
          strokeWidth="4" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Bridge deck with slight curve */}
        <path 
          d="M 25 75 Q 60 72, 95 75" 
          stroke="#002395" 
          strokeWidth="5" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Vertical suspension lines */}
        <line x1="40" y1="35" x2="40" y2="73" stroke="#FFB81C" strokeWidth="1.5" opacity="0.6"/>
        <line x1="50" y1="28" x2="50" y2="72" stroke="#FFB81C" strokeWidth="1.5" opacity="0.6"/>
        <line x1="60" y1="25" x2="60" y2="72" stroke="#FFB81C" strokeWidth="1.5" opacity="0.6"/>
        <line x1="70" y1="28" x2="70" y2="72" stroke="#FFB81C" strokeWidth="1.5" opacity="0.6"/>
        <line x1="80" y1="35" x2="80" y2="73" stroke="#FFB81C" strokeWidth="1.5" opacity="0.6"/>
      </g>
      
      {/* Talent nodes - people connecting */}
      <g>
        {/* Left side talent */}
        <circle cx="35" cy="55" r="4" fill="#007749"/>
        <circle cx="45" cy="60" r="4" fill="#007749"/>
        
        {/* Right side talent */}
        <circle cx="75" cy="60" r="4" fill="#007749"/>
        <circle cx="85" cy="55" r="4" fill="#007749"/>
        
        {/* Center - connection point */}
        <circle cx="60" cy="52" r="5" fill="#E03C31"/>
        <circle cx="60" cy="52" r="8" fill="#E03C31" opacity="0.2"/>
      </g>
      
      {/* Letter T integrated at bottom */}
      <text x="60" y="98" fontSize="32" fontWeight="bold" fill="#002395" textAnchor="middle" fontFamily="'Outfit', sans-serif">T</text>
    </svg>
  );
}

export function TalentBridgeLogoFull({ className = "" }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <TalentBridgeLogo className="w-10 h-10" />
      <span className="text-2xl font-bold font-outfit text-slate-900">TalentBridge</span>
    </div>
  );
}
