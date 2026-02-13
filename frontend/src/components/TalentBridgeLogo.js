export default function TalentBridgeLogo({ className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-2xl font-bold font-outfit text-slate-900 relative">
        <span className="relative inline-block">
          <span className="relative z-10">T</span>
          {/* Bridge design on T crossbar */}
          <span className="absolute top-[0.3em] left-[-0.1em] right-[-0.1em] h-[0.15em] bg-gradient-to-r from-saflag-green via-saflag-gold to-saflag-blue rounded-sm"></span>
          {/* Bridge pillars */}
          <span className="absolute top-[0.25em] left-[0.15em] w-[0.08em] h-[0.6em] bg-saflag-blue rounded-sm"></span>
          <span className="absolute top-[0.25em] right-[0.15em] w-[0.08em] h-[0.6em] bg-saflag-blue rounded-sm"></span>
        </span>
        alent
        <span className="text-saflag-blue">Bridge</span>
      </span>
    </div>
  );
}
