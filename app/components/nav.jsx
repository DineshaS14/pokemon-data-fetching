
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
    return (
        <nav className="flex justify-between items-center px-8 py-3" style={{ backgroundColor: "#060f1b" }}>
            <div className="flex items-center space-x-4 px-0 py-0">
                <Image 
                    src="/dineshalogo.jpg" 
                    alt="Logo" 
                    width={100} 
                    height={30} 
                    className=" border-0"
                />
                <Link 
                    className="font-bold italic text-2xl hover:text-gray-400" 
                    href={"/"}
                    style={{ color: "#29637f" }} // Custom color for Blog text
                >
                </Link>
            </div>
            <Link className=" border-4 border-[#29637f] text-[#29637f] p-2 rounded hover:bg-gray-200 hover:text-red-500" style={{ backgroundColor: "#060f1b"}}href={"/"}>
                Go to Main Page
            </Link>
        </nav>
    );
}

// NavBar