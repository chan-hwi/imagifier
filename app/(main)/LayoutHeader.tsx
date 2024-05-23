"use client";

import { motion } from "framer-motion";
import { BookIcon, SquarePlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const routes = [
	{
		label: "내 단어장",
		path: "/view",
		icon: BookIcon,
	},
	{
		label: "단어 추가",
		path: "/new",
		icon: SquarePlusIcon,
	},
];

function LayoutHeader() {
	const pathname = usePathname();

	return (
		<header className="py-2 flex gap-4 px-4 shadow-md bg-white">
			{routes.map((route) => {
				const Icon = route.icon;
				return (
					<div className="relative" key={route.path}>
						<Link
							href={route.path}
							key={route.path}
							className="p-2 font-semibold flex gap-2 items-center"
						>
							<Icon className="size-4" />
							<span>{route.label}</span>
						</Link>
						{route.path === pathname && (
							<motion.div
								layoutId="underline"
								className="absolute w-full left-0 -bottom-2 h-1 bg-primary"
							/>
						)}
					</div>
				);
			})}
		</header>
	);
}

export default LayoutHeader;
