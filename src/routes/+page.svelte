<script lang="ts">
	import Slider from '@/components/ui/slider/slider.svelte';
	import { loadData } from './data.remote';

	let value = $state(33);
	let isPlaying = $state(false);

	let audioPlayer: HTMLAudioElement | null = $state(null);

	const nowPlayingQuery = loadData();

	let data = $derived.by(() => nowPlayingQuery.current);

	$effect(() => {
		if (audioPlayer) {
			if (isPlaying) {
				audioPlayer.play();
			} else {
				audioPlayer.pause();
			}
		}
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

		{#if nowPlayingQuery.loading}
			<div class="">
				<h1>Loading . . .</h1>
			</div>
		{:else if nowPlayingQuery.error}
			<div class="">
				<h1>Terjadi kesalahan</h1>
			</div>
		{:else if data}
			<div
				class="flex flex-col gap-6 rounded-[29.32px] bg-white/20 p-4 shadow-2xl md:flex-row md:gap-[70px] md:p-10"
			>
				{#if data.now_playing.song.art === 'http://stream.radioalikhwan.com/static/img/generic_song.jpg'}
					<img
						class="md:w-[20vw] rounded-[29.32px] w-full md:rounded-xl"
						src="https://stream.radioalikhwan.com/static/img/generic_song.jpg"
						alt=""
					/>
				{:else}
					<img src={data.now_playing.song.art} alt="" />
				{/if}

				<div class="flex w-full flex-col items-center justify-between md:flex-row">
					<div class="flex flex-col gap-4">
						<h1>Now Playing</h1>
						<h1 class="text-5xl font-semibold">{data.now_playing.song.title}</h1>
						<h1>{data.now_playing.song.artist}</h1>
						<h1>{data.listeners.current} Listening</h1>
						<div class="flex items-center gap-3">
							<img src="/icon/speaker.svg" alt="" class="h-7 w-7" />
							<Slider type="single" bind:value max={100} step={1} />
						</div>

						<audio
							bind:this={audioPlayer}
							src={data.station.listen_url}
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
