import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "../Components/ui/resizable-navbar";

const Navbars = () => {
    const navItems = [
        {
            name: "Home",
            link: "/",
        },
        {
            name: "Ranklist",
            link: "/ranklist",
        },
        {
            name: "Student Profile",
            link: "/studentprofile",
        },
        {
            name: "Transcript",
            link: "/transcriptgenerate",
        },
        {
            name: "About",
            link: "/about",
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <Navbar className="fixed top-2 left-0 w-full z-50 text-white">
                <NavBody>
                    <NavbarLogo className="text-white" />
                    <NavItems items={navItems} className="text-black" />
                    <div className="flex items-center gap-4">
                        <NavbarButton
                            variant="primary"
                            className="text-black"
                            onClick={() => window.open("https://github.com/Jbansal2/Ranknest", "_blank")}
                        >
                            Github
                        </NavbarButton>

                    </div>
                </NavBody>

                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo className="text-black" />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-black"
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <Link
                                key={`mobile-link-${idx}`}
                                to={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-black"
                            >
                                <span className="block">{item.name}</span>
                            </Link>
                        ))}
                        <div className="flex w-full flex-col gap-4">
                            <NavbarButton
                                onClick={() => setIsMobileMenuOpen(false)}
                                variant="primary"
                                className="w-full text-black" 
                            >
                                Github
                            </NavbarButton>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </>
    );
};

export default Navbars;
