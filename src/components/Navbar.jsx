// import React, { useState, useEffect, useRef } from "react";

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const menuRef = useRef(null);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsMenuOpen(false);
//       }
//     };

//     if (isMenuOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isMenuOpen]);

//   return (
//     <nav ref={menuRef} className="w-full h-16 flex justify-between items-center px-4 sm:px-6 bg-black shadow-lg fixed top-10 left-0 z-50 border-b border-[#f5f5f0]/10">
//       <div className="text-2xl font-bold">
//         <a href="/">
//           <img src="/CAHN_Logo_Black_RGB.png" alt="Cahn Logo" className="h-8 filter invert brightness-0" />
//         </a>
//       </div>

//       {/* Desktop Menu */}
//       <ul className="hidden md:flex space-x-6 lg:space-x-8 font-medium list-none">
//         <li>
//           <a href="/#services" className="text-[#f5f5f0]/80 hover:text-[#f5f5f0] transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-[#3957a7]">
//             Services
//           </a>
//         </li>
//         <li>
//           <a href="/#pulse" className="text-[#f5f5f0]/80 hover:text-[#f5f5f0] transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-[#3957a7]">
//             Pulse
//           </a>
//         </li>
//         <li>
//           <a href="/#about" className="text-[#f5f5f0]/80 hover:text-[#f5f5f0] transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-[#3957a7]">
//             About
//           </a>
//         </li>
//         <li>
//           <a href="/course" className="text-[#f5f5f0]/80 hover:text-[#f5f5f0] transition-colors duration-200 py-2 px-1 border-b-2 border-transparent hover:border-[#31af9c]">
//             Learn
//           </a>
//         </li>
//         <li>
//           <a href="/contact" className="px-4 py-2 bg-[#e64726] text-white rounded-lg hover:bg-[#e64726]/90 transition-colors duration-200 font-medium">
//             Work with Us
//           </a>
//         </li>
//       </ul>

//       {/* Mobile Menu Button */}
//       <button
//         className="md:hidden text-[#f5f5f0] focus:outline-none p-2 -mr-2 touch-manipulation"
//         onClick={toggleMenu}
//         aria-label="Toggle menu"
//         aria-expanded={isMenuOpen}
//       >
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           {isMenuOpen ? (
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           ) : (
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           )}
//         </svg>
//       </button>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="absolute top-16 left-0 right-0 bg-black border-t border-[#f5f5f0]/10 md:hidden z-50 shadow-lg">
//           <ul className="flex flex-col space-y-1 p-4 font-medium list-none">
//             <li>
//               <a 
//                 href="/#services" 
//                 className="block text-[#f5f5f0]/80 py-3 px-4 rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors duration-200 touch-manipulation"
//                 onClick={closeMenu}
//               >
//                 Services
//               </a>
//             </li>
//             <li>
//               <a 
//                 href="/#pulse" 
//                 className="block text-[#f5f5f0]/80 py-3 px-4 rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors duration-200 touch-manipulation"
//                 onClick={closeMenu}
//               >
//                 Pulse
//               </a>
//             </li>
//             <li>
//               <a 
//                 href="/#about" 
//                 className="block text-[#f5f5f0]/80 py-3 px-4 rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors duration-200 touch-manipulation"
//                 onClick={closeMenu}
//               >
//                 About
//               </a>
//             </li>
//             <li>
//               <a 
//                 href="/course" 
//                 className="block text-[#f5f5f0]/80 py-3 px-4 rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors duration-200 touch-manipulation"
//                 onClick={closeMenu}
//               >
//                 Learn
//               </a>
//             </li>
//             <li>
//               <a 
//                 href="/contact" 
//                 className="block text-white py-3 px-4 bg-[#e64726] rounded-lg hover:bg-[#e64726]/90 transition-colors duration-200 touch-manipulation text-center mt-2"
//                 onClick={closeMenu}
//               >
//                 Work with Us
//               </a>
//             </li>
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// }
