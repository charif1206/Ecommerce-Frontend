import {useState} from "react";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import NavBar from "./NavBar";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md">
            <div className="w-full px-4 py-3 flex items-center justify-between gap-4">
                <HeaderLeft className="shrink-0" />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-1 max-w-3xl mx-4">
                    <NavBar />
                </div>

                {/* Desktop Header Right */}
                <div className="hidden lg:flex shrink-0">
                    <HeaderRight />
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="lg:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {isMenuOpen ? (
                            <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white shadow-md">
                    <div className="px-4 py-3 space-y-4">
                        <NavBar />
                        <HeaderRight />
                    </div>
                </div>
            )}
        </header>
    );
}
