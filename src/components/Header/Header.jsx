import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import NavBar from "./NavBar";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white shadow-md">
            <div className="w-full px-4 py-3 flex items-center justify-between gap-4">
                {/* Left Logo Section */}
                <HeaderLeft className="shrink-0" />

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-1 max-w-3xl mx-4">
                    <NavBar />
                </div>

                {/* Desktop Right Section */}
                <div className="hidden lg:flex shrink-0">
                    <HeaderRight />
                </div>

                {/* Mobile Menu */}
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="w-7 h-7" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="top"
                        className="w-full h-auto max-h-screen bg-white p-6 shadow-md border-b border-gray-200 transition-transform duration-300 ease-in-out"
                    >
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-lg font-semibold">Menu</h2>
                        </div>
                        <div className="py-6 space-y-6">
                            <NavBar onLinkClick={handleLinkClick} />
                            <HeaderRight />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
