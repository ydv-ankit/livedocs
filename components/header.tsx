import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = ({ children, className }: HeaderProps) => {
	return (
		<div className={cn("header", className)}>
			<Link
				href={"/"}
				className="md:flex-1 flex gap-2 items-center cursor-pointer">
				<Image
					src={"/assets/images/logo.png"}
					alt="logo with name"
					width={28}
					height={28}
				/>
				<p>LiveDocs</p>
			</Link>
			{children}
		</div>
	);
};

export default Header;
