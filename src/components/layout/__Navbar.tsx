import Image from "next/image";
import Link from "next/link";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import NavbarMenu from "./NavbarMenu";
import Container from "@/components/Container";

export function Navbar() {
    const isScrolled = useScrollDetection({ threshold: 50 });
    return (
        <nav 
            className={`bg-white text-gray-700 sticky z-50 shadow-md h-16 transition-all duration-500 ease-in-out ${
              isScrolled ? 'top-0 -mt-8' : 'top-0'
            }`}
        >
            <div className={`container mx-auto px-4 h-full transition-all duration-300`}>
              <div className="flex justify-between items-center h-full">
              <Container className="flex items-center justify-between text-lightColor">
                {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-14 h-14 relative flex items-center justify-center transition-all duration-300">
                <Image 
                  src="/logo.png" 
                  alt="Pharmacy Logo" 
                  width={50}
                  height={50}
                  className="transition-all duration-300"
                />
              </div>
            </Link>
                <NavbarMenu />
            </Container>
              </div>
            </div>
        </nav>
    );
}