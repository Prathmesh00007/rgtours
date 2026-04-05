import aboutImg from "../assets/images/about_img.png";
import { FaExternalLinkAlt, FaGithub, FaLinkedin } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-travel-light to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-travel-primary to-travel-secondary p-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">About Us</h1>
            <p className="text-white/90 text-lg">Discover the world with RG Tours</p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="flex-shrink-0">
                <img
                  src={aboutImg}
                  className="w-48 h-48 rounded-full object-cover border-4 border-travel-primary shadow-lg"
                  alt="About"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold text-travel-dark mb-4">Prathmesh Ranade</h2>
                <p className="text-gray-600 text-lg mb-6">
                  Passionate developer creating amazing travel experiences
                </p>
                
                {/* Social Links */}
                <div className="flex gap-4 justify-center md:justify-start">
                  <a
                    href="https://github.com/Sanjayng125"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <FaGithub className="text-xl" />
                    <span>GitHub</span>
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                  <a
                    href="https://linkedin.com/in/sanjay-ng-41b64922a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <FaLinkedin className="text-xl" />
                    <span>LinkedIn</span>
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-2xl font-bold text-travel-dark mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                RG Tours is dedicated to making travel accessible and memorable for everyone. 
                We believe that every journey should be an adventure filled with discovery, 
                relaxation, and unforgettable experiences. Our carefully curated packages are 
                designed to showcase the beauty of destinations around the world while providing 
                exceptional value and service.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                Whether you're seeking a relaxing beach getaway, an adventurous mountain trek, 
                or a cultural city exploration, we have the perfect package for you. Join us 
                in exploring the world and creating memories that will last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
