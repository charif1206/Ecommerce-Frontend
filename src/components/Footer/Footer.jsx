import {FaGithub, FaLinkedin, FaTwitter} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Company Name</h3>
                        <p className="text-gray-300">
                            123 Test Street
                            <br />
                            City, State 12345
                            <br />
                            contact@example.com
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Services
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-gray-300">
                                <FaGithub size={24} />
                            </a>
                            <a href="#" className="hover:text-gray-300">
                                <FaTwitter size={24} />
                            </a>
                            <a href="#" className="hover:text-gray-300">
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
