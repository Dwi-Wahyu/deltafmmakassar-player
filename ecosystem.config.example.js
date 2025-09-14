module.exports = {
	apps: [
		{
			name: 'deltafmmakassar-player',
			script: '.svelte-kit/output/server/index.js',
			interpreter: 'node',
			env: {
				NITRO_PORT: 4001,
				PORT: 4001,
				NODE_ENV: 'production'
			},
			autorestart: true,
			watch: false
		}
	]
};
