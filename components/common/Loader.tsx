"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import React from "react";

interface LoaderProps {
	className?: string;
}

function Loader({ className }: LoaderProps) {
	return (
		<Loader2Icon
			className={cn("animate-spin h-10 w-10 text-gray-500", className)}
		/>
	);
}

export default Loader;
