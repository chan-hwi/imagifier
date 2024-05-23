import { useEffect, useState } from "react";

export const useFetch = <T extends (...args: any) => any>(
	fetchFunc: T,
	...args: Parameters<T>
) => {
	const [data, setData] = useState<Awaited<ReturnType<T>> | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		fetchFunc(...args)
			.then((data: Awaited<ReturnType<T>>) => {
				setLoading(false);
				setData(data);
			})
			.catch((error: any) => {
				setLoading(false);
				setError(error);
			});
	}, args);

	return {
		data,
		loading,
		error,
	};
};
