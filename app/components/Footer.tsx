import Link from "next/link";

export default function Footer() {
    return (
<footer className="bg-[#060f1b] text-[#29637f] text-center py-4">
    <p className="text-sm hover:text-red-500">© 2024 Dinesha&#39;s Blog. All rights reserved.</p>
    <div className="flex justify-center space-x-4 mt-2">
        <a href="https://www.linkedin.com/in/dineshas14/" className="hover:text-red-500">Contact for Privacy Policy and Terms of Service </a>

    </div>
</footer>
    );
}