import { useEffect, useState, useCallback } from 'react';

const useFetch = (url, method) => {
	const token = localStorage.getItem('token');

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	if (!url || url.length === 0) {
		console.error('Missing url');
		if (!error) setError(true);
		if (loading) setLoading(false);
		return { data, loading, error };
	}
	if (!token) {
		console.error('No token mate');
		if (!error) setError(true);
		if (loading) setLoading(false);
		return { data, loading, error };
	}

	const runFetchProcess = useCallback(
		async (data) => {
			setSuccess(false);
			setLoading(true);
			const requestMethod = method === 'POST' ? 'POST' : 'GET';
			let requestHeader = {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`,
					'Content-Type': 'application/json',
				},
				method: requestMethod,
			};

			if (data) {
				requestHeader.body = JSON.stringify(data);
			}
			try {
				const response = await fetch(url, requestHeader);
				const responseData = await response?.json();
				if (!response.ok) {
					setLoading(false);
					setError(true);
					throw Error('something wrong here mate');
				} else {
					//			console.log(responseData);
					setData(responseData);
					setLoading(false);
					setSuccess(true);
				}
			} catch (e) {
				setError(true);
				console.error('useFetch.js', e);
			} finally {
				setLoading(false);
			}
		},
		[error, method, url]
	);

	const post = (data) => {
		if (!data) {
			setError(true);
			return;
		}
		runFetchProcess(data);
	};

	useEffect(() => {
		if (!method) {
			runFetchProcess();
		}
	}, [method, runFetchProcess]);

	//	console.log(data);

	return { data, loading, error, fetch: runFetchProcess, post, success };
};

export default useFetch;
