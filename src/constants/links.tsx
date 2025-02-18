
import {
	FaFacebookF,
	FaInstagram,
	FaTiktok,
	FaXTwitter,
} from "react-icons/fa6";

export const navbarLinks = [
	{
		id: 1,
    title: "หน้าแรก",
    href: "/",
	},
	{
		id: 2,
    title: "หนังสือ",
    href: "/celulares",
	},
	{
		id: 3,
    title: "เกี่ยวกับเรา",
    href: "/nosotros",
	},
];

export const socialLinks = [
	{
		id: 1,
    title: "เฟซบุ๊ก",
    href: "https://www.facebook.com",
		icon: <FaFacebookF />,
	},
	{
		id: 2,
    title: "ทวิตเตอร์",
    href: "https://www.twitter.com",
		icon: <FaXTwitter />,
	},
	{
		id: 3,
    title: "อินสตาแกรม",
    href: "https://www.instagram.com",
		icon: <FaInstagram />,
	},
	{
		id: 4,
    title: "ติ๊กต็อก",
    href: "https://www.tiktok.com",
		icon: <FaTiktok />,
	},
];
