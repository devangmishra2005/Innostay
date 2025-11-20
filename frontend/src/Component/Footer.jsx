import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 mt-16 border-t border-gray-300">
      {/* Footer main section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Column 1 */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Support</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Help Centre</a></li>
            <li><a href="#" className="hover:underline">AirCover</a></li>
            <li><a href="#" className="hover:underline">Safety information</a></li>
            <li><a href="#" className="hover:underline">Cancellation options</a></li>
            <li><a href="#" className="hover:underline">Report a neighbourhood concern</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Hosting</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Airbnb your home</a></li>
            <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
            <li><a href="#" className="hover:underline">Hosting resources</a></li>
            <li><a href="#" className="hover:underline">Community forum</a></li>
            <li><a href="#" className="hover:underline">Responsible hosting</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Community</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Accessibility</a></li>
            <li><a href="#" className="hover:underline">Combating discrimination</a></li>
            <li><a href="#" className="hover:underline">Guest referral program</a></li>
            <li><a href="#" className="hover:underline">Gift cards</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h2 className="font-semibold text-lg mb-3">About</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Newsroom</a></li>
            <li><a href="#" className="hover:underline">Learn about new features</a></li>
            <li><a href="#" className="hover:underline">Investors</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Founders' letter</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-300 mt-6 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2025 YourHome, Inc. · Privacy · Terms · Sitemap</p>

          <div className="flex items-center space-x-4 mt-3 md:mt-0">
            <a href="#" className="hover:underline">English (IN)</a>
            <a href="#" className="hover:underline">₹ INR</a>
            <div className="flex space-x-3">
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="w-5 h-5" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" className="w-5 h-5" /></a>
              <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
