import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 text-center mt-auto">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <span className="text-gray-400">TiffinSetu</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">
            Bridging Taste. Delivering Trust.
          </span>
        </div>
        {/* <p className="text-sm text-gray-400">
          © 2026 TiffinSetu – <span className="font-medium text-gray-200">Mayank Shaw (NIT PATNA) </span>made with ❤️ for tiffin lovers across India.
        </p> */}
        <p className="text-sm text-gray-400">
          © 2026 TiffinSetu – Developed by{" "}
          <a
            href="https://www.linkedin.com/in/mayankshaw20/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-200 hover:text-white underline transition-colors"
          >
            Mayank Shaw (NIT PATNA)
          </a>{" "}
          made with ❤️ for tiffin lovers across India (🇮🇳).
        </p>
      </div>
    </footer>
  );
};

export default Footer;
