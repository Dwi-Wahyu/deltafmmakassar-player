interface NowPlayingResponse {
	station: Station;
	listeners: Listeners;
	live: Live;
	now_playing: NowPlaying;
	playing_next: NowPlaying | null;
	song_history: NowPlaying[];
	is_online: boolean;
	cache: any | null;
}

interface Station {
	id: number;
	name: string;
	shortcode: string;
	description: string;
	frontend: string;
	backend: string;
	timezone: string;
	listen_url: string;
	url: string;
	public_player_url: string;
	playlist_pls_url: string;
	playlist_m3u_url: string;
	is_public: boolean;
	mounts: Mount[];
	remotes: any[];
	hls_enabled: boolean;
	hls_is_default: boolean;
	hls_url: string | null;
	hls_listeners: number;
}

interface Mount {
	id: number;
	name: string;
	url: string;
	bitrate: number | null;
	format: string | null;
	listeners: Listeners;
	path: string;
	is_default: boolean;
}

interface Listeners {
	total: number;
	unique: number;
	current: number;
}

interface Live {
	is_live: boolean;
	streamer_name: string;
	broadcast_start: number | null;
	art: string | null;
}

interface NowPlaying {
	sh_id: number;
	played_at: number;
	duration: number;
	playlist: string;
	streamer: string;
	is_request: boolean;
	song: Song;
	elapsed?: number;
	remaining?: number;
}

interface Song {
	id: string;
	art: string;
	custom_fields: any[];
	text: string;
	artist: string;
	title: string;
	album: string;
	genre: string;
	isrc: string;
	lyrics: string;
}
