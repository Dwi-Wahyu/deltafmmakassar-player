import { query } from '$app/server';

export const loadData = query(async () => {
	const res = await fetch('https://stream.radioalikhwan.com/api/nowplaying/delta_fm_makassar');

	if (!res.ok) {
		return null;
	}

	const data: NowPlayingResponse = await res.json();

	return data;
});
