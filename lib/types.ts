export interface TIACBody {
	word: string;
	definition: string;
}

export interface IChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

export type TaskStatus =
	| "TASK_STATUS_QUEUED"
	| "TASK_STATUS_SUCCEED"
	| "TASK_STATUS_PROCESSING"
	| "TASK_STATUS_FAILED";

export interface TaskResultVideo {
	video_url: string;
	video_url_ttl: string;
	video_type: string;
}

export interface TaskResult {
	task: {
		task_id: string;
		task_type: string;
		status: TaskStatus;
		reason: string;
		eta: number;
		progress_percent: number;
	};
	videos: TaskResultVideo[];
}