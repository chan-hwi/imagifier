"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { useMeanings, useWord } from "@/stores/WordStore";
import {
	genTIACDescription,
	genTIACVideo,
	genTranslatedMeanings,
	getTIACVideoStatus,
} from "@/lib/server";
import Loader from "../common/Loader";
import { ArrowBigRightIcon, PlusIcon } from "lucide-react";
import { useDictionaryActions } from "@/stores/DictionaryStore";
import { toast } from "sonner";
import Link from "next/link";
import { TaskStatus } from "@/lib/types";
import { Progress } from "../ui/progress";

function VideoGen() {
	const word = useWord();
	const meanings = useMeanings();
	const actions = useDictionaryActions();
	const [data, setData] = useState<string>("");
	const [imageUrl, setImageUrl] = useState<string>("");
	const [taskId, setTaskId] = useState<string | null>(null);
	const [added, setAdded] = useState<boolean>(false);
	const [status, setStatus] = useState<TaskStatus | null>(null);
	const [percent, setPercent] = useState<number>(0);
	const [remain, setRemain] = useState<number>(0);
	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

	const [pending, startTransition] = useTransition();
	const [pendingImage, startImageTransition] = useTransition();
	const [pendingAdd, startAddTransition] = useTransition();

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
					setStatus("TASK_STATUS_QUEUED");
					setPercent(0);
					setRemain(0);
					const curTaskId = await genTIACVideo(res);
					if (!curTaskId) {
						toast.error("이미지 생성에 실패했습니다.");
						setStatus(null);
						setPercent(0);
						setRemain(0);
						return;
					}
					setTaskId(curTaskId);
				} catch (err) {
					setStatus(null);
					setPercent(0);
					setRemain(0);
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

	useEffect(() => {
		if (taskId && intervalRef.current) return;

		intervalRef.current = setInterval(async () => {
			if (!taskId) return;
			const res = await getTIACVideoStatus(taskId);
			if (!res) {
				toast.error("이미지 생성에 실패했습니다.");
				setTaskId(null);
				return;
			}
			console.log(res);
			setStatus(res.task.status);
			setPercent(res.task.progress_percent);
			setRemain(res.task.eta);
			if (res.task.status === "TASK_STATUS_SUCCEED") {
				setImageUrl(res.videos?.[0].video_url);
				setTaskId(null);
			}
		}, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
			intervalRef.current = null;
		};
	}, [taskId]);

	if (meanings.length === 0) return null;
	const isLoading =
		status !== "TASK_STATUS_SUCCEED" && status !== "TASK_STATUS_FAILED";

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
					{isLoading && (
						<div className="my-8 flex justify-center items-center">
							<VideoLoading status={status} percent={percent} remain={remain} />
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

export default VideoGen;

interface VideoLoadingProps {
	status: TaskStatus | null;
	percent: number;
	remain: number;
}

const LoadingLabel: Record<TaskStatus, string> = {
	TASK_STATUS_QUEUED: "이미지 생성 대기 중...",
	TASK_STATUS_SUCCEED: "이미지 생성 완료",
	TASK_STATUS_PROCESSING: "이미지 생성 중...",
	TASK_STATUS_FAILED: "이미지 생성 실패",
};

function VideoLoading({ status, percent, remain }: VideoLoadingProps) {
	const isProcessing = status === "TASK_STATUS_PROCESSING";

	if (!status) return null;

	return (
		<div className="flex flex-col gap-4 items-center">
			<div className="flex items-center gap-2">
				<Loader className="size-4" />
				<p>{LoadingLabel[status]}</p>
			</div>
			{isProcessing && (
				<>
					<p className="text-sm text-muted-foreground">
						예상 대기 시간: {remain}초
					</p>
					<div className="flex items-center gap-2 text-sm w-full">
						<Progress value={percent} />
					</div>
				</>
			)}
		</div>
	);
}
