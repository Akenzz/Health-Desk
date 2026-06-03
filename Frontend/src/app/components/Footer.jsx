import React from "react";
import { ArrowUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full">
      <div className="flex items-center justify-center gap-4 border-t border-cyan-100 bg-white/90 p-4 text-gray-700 backdrop-blur">
        <p>&copy; 2026 HealthDesk. All rights reserved.</p>
        <a
          href="#"
          className="p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 transition-colors group"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} className="animate-bounce group-hover:animate-none" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;