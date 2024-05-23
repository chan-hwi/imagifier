"use client";

import React, { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { useMeanings, useWord } from "@/stores/WordStore";
import {
	genTIACDescription,
	genTIACImage,
	genTranslatedMeanings,
} from "@/lib/server";
import Loader from "../common/Loader";
import { ArrowBigRightIcon, PlusIcon } from "lucide-react";
import { useDictionaryActions } from "@/stores/DictionaryStore";
import { toast } from "sonner";
import Link from "next/link";

function ImageGen() {
	const word = useWord();
	const meanings = useMeanings();
	const actions = useDictionaryActions();
	const [data, setData] = useState<string>("");
	const [imageUrl, setImageUrl] = useState<string>("");
	const [added, setAdded] = useState<boolean>(false);
	const [pending, startTransition] = useTransition();
	const [pendingImage, startImageTransition] = useTransition();
	const [pendingAdd, startAddTransition] = useTransition();

	if (meanings.length === 0) return null;

	const handleGenerate = () => {
		setImageUrl("");
		startTransition(async () => {
			const definition = meanings[0].definitions[0].definition;
			if (!word || !definition) {
				toast.error("존재하지 않는 단어입니다");
				return;
			}
			const res = await genTIACDescription({ word, definition });
			if (!res) {
				toast.error("프롬프트 생성에 실패했습니다.");
				return;
			}
			setData(res);
			startImageTransition(async () => {
				try {
					const imageRes = await genTIACImage(res);
					if (!imageRes) {
						toast.error("이미지 생성에 실패했습니다.");
						return;
					}
					setImageUrl(imageRes);
				} catch (err) {
					toast.error("이미지 생성에 실패했습니다.");
				}
			});
		});
	};

	const handleAddToDictionary = () => {
		if (!word) {
			toast.error("단어를 입력해주세요");
			return;
		}
		if (!imageUrl) {
			toast.error("이미지를 생성해주세요");
			return;
		}
		startAddTransition(async () => {
			const res = await genTranslatedMeanings(word);
			if (!res) {
				toast.error("단어의 뜻을 가져오는데 실패했습니다.");
				return;
			}
			actions?.addItem({
				word,
				meanings: res.split(","),
				imageUrl,
				prompt: data,
			});
			setAdded(true);
			toast.success("단어장에 성공적으로 추가되었습니다.");
		});
	};

	return (
		<div className="flex flex-col gap-8">
			<Button className="self-end" disabled={pending} onClick={handleGenerate}>
				{pending && <Loader className="mr-2 size-4 text-white" />}
				<span>내 단어장 이미지 생성</span>
			</Button>
			{data && (
				<div className="flex flex-col gap-6">
					<div className="space-y-1">
						<h3 className="font-semibold">이미지 입력 프롬프트</h3>
						<p>{data}</p>
					</div>
					{pendingImage && (
						<div className="flex flex-col gap-3 justify-center items-center">
							<Loader />
							<p className="text-sm text-muted-foreground">이미지 생성 중...</p>
						</div>
					)}
					{imageUrl && <img src={imageUrl} />}
					{!added ? (
						<Button
							className="w-fit self-end"
							disabled={pendingAdd}
							onClick={handleAddToDictionary}
						>
							{pendingAdd ? (
								<Loader className="mr-2 size-4 text-white" />
							) : (
								<PlusIcon className="size-4 mr-2" />
							)}

							<span>단어장에 이미지 추가</span>
						</Button>
					) : (
						<Button asChild className="w-fit self-end" variant="secondary">
							<Link href="/view">
								<ArrowBigRightIcon className="size-4 mr-2" />
								<span>단어장으로 이동</span>
							</Link>
						</Button>
					)}
				</div>
			)}
		</div>
	);
}

export default ImageGen;
