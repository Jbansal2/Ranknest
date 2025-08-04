import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-2 text-gray-200 text-center border-t border-zinc-600 mt-auto">
      <p className="text-base sm:text-md italic">
        Designed ✦ Developed ✦ Deployed by Jitendra Bansal | © {currentYear} Ranknest
      </p>

    </footer>
  );
};

export default Footer;
