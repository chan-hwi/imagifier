import React, { PropsWithChildren } from "react";
import LayoutHeader from "./LayoutHeader";

function MainLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex flex-col">
			<LayoutHeader />
			{children}
		</div>
	);
}

export default MainLayout;
