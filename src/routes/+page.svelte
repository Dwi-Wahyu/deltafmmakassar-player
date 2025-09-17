<script lang="ts">
	import { io } from 'socket.io-client';
	import Slider from '@/components/ui/slider/slider.svelte';
	import { onDestroy, onMount } from 'svelte';

	let socket = io();

	let isPlaying = $state(false);
	let totalListener = $state(0);

	let audioPlayer: HTMLAudioElement | null = $state(null);

	let isLoading = $state(true);
	let isError = $state(false);

	let data = $state<NowPlayingResponse | null>(null);

	let volume = $state(1);
	let mute = $state(false);

	function toggleMute() {
		mute = !mute;
		volume = mute ? 0 : 1;
	}

	$effect(() => {
		if (audioPlayer) {
			audioPlayer.volume = volume;
		}
	});

	$effect(() => {
		if (audioPlayer) {
			if (isPlaying) {
				audioPlayer.play();
			} else {
				audioPlayer.pause();
			}
		}
	});

	async function handleFetchData() {
		try {
			const res = await fetch('https://stream.radioalikhwan.com/api/nowplaying/delta_fm_makassar');

			if (!res.ok) {
				console.error('Failed to fetch data');
				isError = true;
				return;
			}

			const responseData: NowPlayingResponse = await res.json();

			if (responseData.now_playing && responseData.now_playing.song.artist.trim() === 'AL IKHWAN') {
				responseData.now_playing.song.title = 'Delta 99.2 Makassar';
			}

			if (responseData.song_history && Array.isArray(responseData.song_history)) {
				responseData.song_history = responseData.song_history.map((item) => {
					if (item.song.artist.trim() === 'AL IKHWAN') {
						return {
							...item,
							song: {
								...item.song,
								title: 'Delta 99.2 Makassar',
								artist: ''
							}
						};
					}
					return item;
				});
			}

			data = responseData;
		} catch (error) {
			isError = true;
			console.error('An error occurred:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		socket.emit('add online user');
		socket.on('total listener', (total: number) => {
			totalListener = total;
		});

		handleFetchData();

		const interval = setInterval(() => {
			handleFetchData();
		}, 10000);

		window.addEventListener('beforeunload', () => {
			socket.disconnect();
			clearInterval(interval);
		});

		return () => clearInterval(interval);
	});

	onDestroy(() => {
		socket.disconnect();
	});
</script>

<div
	class="min-h-svh w-full bg-[url('/landing-background.png')] bg-cover bg-center p-4 text-white md:px-[89px] md:py-[75px]"
>
	<div class="rounded-[29.32px] bg-white/10 p-4 md:p-[36px]">
		<div class="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
			<img src="/logo/delta.png" alt="" class="h-28 w-28" />

			<div
				class="flex w-full flex-col items-center gap-2 rounded-[29.32px] bg-white/20 p-4 shadow-2xl md:w-fit md:flex-row md:rounded-xl"
			>
				<h1>Follow Us In Social :</h1>

				<div class="flex items-center gap-3">
					<a href="/">
						<img src="/logo/facebook.svg" alt="" />
					</a>

					<a href="/">
						<img src="/logo/instagram.svg" alt="" />
					</a>

					<a href="/">
						<img src="/logo/youtube.svg" alt="" />
					</a>

					<a href="/">
						<img src="/logo/tiktok.svg" alt="" />
					</a>

					<a href="/">
						<img src="/logo/twitter.svg" alt="" />
					</a>
				</div>
			</div>
		</div>

		{#if isLoading}
			<div class="">
				<h1>Loading . . .</h1>
			</div>
		{:else if isError}
			<div class="">
				<h1>Terjadi kesalahan</h1>
			</div>
		{:else if data}
			<div
				class="flex flex-col gap-6 rounded-[29.32px] bg-white/20 p-4 shadow-2xl md:flex-row md:gap-[70px] md:p-10"
			>
				<!-- {#if data.now_playing.song.art === 'http://stream.radioalikhwan.com/static/img/generic_song.jpg'}
					<img
						class="md:w-[20vw] rounded-[29.32px] w-full md:rounded-xl"
						src="https://stream.radioalikhwan.com/static/img/generic_song.jpg"
						alt=""
					/>
				{:else}
					<img src={data.now_playing.song.art} alt="" />
				{/if} -->

				<img class="md:w-[20vw] w-full" src="/logo/delta-warna.png" alt="" />

				<div class="flex w-full flex-col items-center justify-between md:flex-row">
					<div class="flex flex-col gap-4">
						<h1>Now Playing</h1>
						<h1 class="text-5xl font-semibold">{data.now_playing.song.title}</h1>
						<h1>{data.now_playing.song.artist}</h1>
						<h1>{totalListener} Listening</h1>
						<div class="flex items-center gap-3">
							<button onclick={toggleMute}>
								{#if volume === 0}
									<img src="/icon/mute.svg" class="w-7" alt="Mute" />
								{:else}
									<img src="/icon/unmute.svg" class="w-7" alt="Unmute" />
								{/if}
							</button>

							<Slider type="single" bind:value={volume} max={1} min={0} step={0.01} />
						</div>

						<audio
							bind:this={audioPlayer}
							src={'https://stream.radioalikhwan.com/listen/delta_fm_makassar/stream'}
							onerror={() => console.error('Audio playback error.')}
						></audio>
					</div>
					<button class="cursor-pointer" onclick={() => (isPlaying = !isPlaying)}>
						{#if isPlaying}
							<img src="/icon/pause.svg" alt="" />
						{:else}
							<img src="/icon/play.svg" alt="" />
						{/if}
					</button>
				</div>
			</div>

			<div class="mt-10">
				<h1 class="mb-6 text-2xl font-bold">Recent Song</h1>

				<div class="grid gap-5 grid-cols-1 md:grid-cols-3">
					{#each data.song_history as history}
						<div class="relative rounded-xl">
							<div
								class="relative left-0 w-full h-full rounded-xl flex justify-center items-center top-0 z-10"
							>
								{#if history.song.art === 'http://stream.radioalikhwan.com/static/img/generic_song.jpg'}
									<img
										class="w-full rounded-xl"
										src="https://stream.radioalikhwan.com/static/img/generic_song.jpg"
										alt=""
									/>
								{:else}
									<img class="w-full rounded-xl" src={history.song.art} alt="" />
								{/if}
							</div>

							<div
								class="flex absolute left-0 top-0 z-20 h-full rounded-xl w-full flex-col justify-end gap-2 bg-black/60 p-4"
							>
								<h1 class="text-2xl font-bold">{history.song.title}</h1>
								<h1>{history.song.artist}</h1>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<h1>studio sedang offline</h1>
		{/if}
	</div>

	<div class="mx-auto mt-10 flex w-full items-center justify-center gap-1">
		Copyright

		<img src="/icon/copyright.svg" alt="" />

		SkytelIndo
	</div>
</div>
