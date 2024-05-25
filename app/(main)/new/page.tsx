import ImageGen from "@/components/TIAC/ImageGen";
import VideoGen from "@/components/TIAC/VideoGen";
import Dictionary from "@/components/dictionary/Dictionary";
import React from "react";

function WordCreatePage() {
	return (
		<div className="container flex flex-col gap-4 py-12">
			<Dictionary />
			{/* <ImageGen /> */}
			<VideoGen />
		</div>
	);
}

export default WordCreatePage;
