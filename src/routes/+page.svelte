<script lang="ts">
	import { textfit } from 'svelte-textfit';
	import type { Snapshot } from './$types';
	import { onMount } from 'svelte';
	import type WF from 'webfontloader';
	import { toJpeg, toPng } from 'html-to-image';
	import download from 'downloadjs';
	import filenamify from 'filenamify';
	import { themeChange } from 'theme-change';

	let WebFont: typeof WF;

	onMount(() => {
		themeChange(false);
		import('webfontloader')
			.then((module) => {
				WebFont = module.default;
			})
			.then(onFontChange);
	});

	let parent: HTMLElement;
	let profileCanvas: HTMLElement;
	let profileBgColor = '#ff0000';
	let profileTextColor = '#ffffff';
	let profileFontFamily = 'Inter';
	let profileFontSize = 100;

	const bgPreset = [
		'#ffffff',
		'#dfe2e9',
		'#caccd1',
		'#ffb1d2',
		'#f88fbb',
		'#ff8184',
		'#f89973',
		'#fadc64',
		'#67cbb3',
		'#67cbb3',
		'#01c78a',
		'#64afee',
		'#5575ee',
		'#9e7aff',
		'#f463ae',
		'#f33268',
		'#f77643',
		'#ef4d33',
		'#fac522',
		'#48ae0a',
		'#48ae0a',
		'#0da944',
		'#3951e1',
		'#1a2d9d',
		'#212b67',
		'#8b47e0',
		'#7233c0',
		'#7417b6',
		'#3f1178',
		'#59493f',
		'#593a2a',
		'#1e1e23',
		'#3e3e49'
	];

	const textColorPreset = [...bgPreset];

	let isLoadingFont = false;
	interface FontStatus {
		status: 'inactive' | 'active' | 'loading';
		name: string;
	}
	let fontsStatus: FontStatus[] = [];

	export const snapshot: Snapshot = {
		capture() {
			return {
				profileBgColor,
				profileTextColor,
				profileFontFamily
			};
		},
		restore(data) {
			profileBgColor = data.profileBgColor;
			profileTextColor = data.profileTextColor;
			profileFontFamily = data.profileFontFamily;
		}
	};

	function onFontChange() {
		WebFont.load({
			google: {
				families: [profileFontFamily],
				text: parent.innerText
			},
			loading() {
				isLoadingFont = true;
				console.info({ fontsStatus });
			},
			active() {
				isLoadingFont = false;
				console.info({ fontsStatus });
			},
			inactive() {
				isLoadingFont = false;
				console.info({ fontsStatus });
			},
			fontactive(familyName, fvd) {
				fontsStatus = [
					...fontsStatus,
					{
						status: 'active',
						name: familyName
					}
				];
			},
			fontinactive(familyName, fvd) {
				fontsStatus = [
					...fontsStatus,
					{
						status: 'inactive',
						name: familyName
					}
				];
			},
			fontloading(familyName, fvd) {
				fontsStatus = [
					...fontsStatus,
					{
						status: 'loading',
						name: familyName
					}
				];
			}
		});
	}

	function exportToPng() {
		toPng(profileCanvas).then((dataUrl) => {
			download(dataUrl, filenamify(parent.innerText, { replacement: '-' }));
		});
	}

	function exportToJpeg() {
		toJpeg(profileCanvas).then((dataUrl) => {
			download(dataUrl, filenamify(parent.innerText, { replacement: '-' }));
		});
	}

	const availableThemes = [
		'light',
		'dark',
		'cyberpunk',
		'aqua',
		'forest',
		'wireframe',
		'night',
		'winter'
	];
</script>

<svelte:head>
	<title>Simple Text Profile Creator</title>
</svelte:head>

<main class="m-5 flex flex-col">
	<div class="flex justify-center max-w-96 max-h-96 text-center sticky">
		<div
			class="absolute w-full h-full border-[2px] border-dashed border-white/40 max-w-xs max-h-xs z-10 rounded-full"
		/>
		<div
			id="profile-canvas"
			bind:this={profileCanvas}
			class="w-full max-w-xs aspect-square overflow-hidden text-center flex-col relative"
			style:background={profileBgColor}
			style:color={profileTextColor}
			style:font-family={profileFontFamily}
		>
			<div
				class="w-[75%] h-3/4 flex items-center justify-center flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[calc(50%+2px)] z-20"
				contenteditable="true"
				bind:this={parent}
				use:textfit={{
					parent,
					mode: 'multi',
				}}
				style:font-size={`${profileFontSize}px`}
			>
				Hello :)
			</div>
		</div>
	</div>
	<div class="text-center mt-6 join m-auto">
		<button class="btn btn-sm join-item" on:click|preventDefault={exportToPng}>
			Save as PNG
		</button>
		<button class="btn btn-sm join-item" on:click|preventDefault={exportToJpeg}>
			Save as JPEG</button
		>
	</div>
	<section class="m-auto p-8 flex flex-col max-w-md justify-center items-center object-center">
		 <h2>Font size: {profileFontSize}px</h2>
		<input type="range" class="range range-accent range-sm" bind:value={profileFontSize} min={20} max={200}/>
	</section>
	<div
		class="p-8 flex flex-col justify-center content-center items-center object-center md:flex md:flex-row md:flex-wrap"
	>
		<section class="text-center max-w-lg">
			<h2>Background Color</h2>
			<code>{profileBgColor}</code>
			<div class="p-4">
				<div class="overflow-y-auto overflow-x-hidden max-h-24">
					{#each bgPreset as color}
						<button
							class="w-8 h-6 m-1 rounded-full cursor-pointer shadow-md border-2 dark:border-gray-300"
							style:background={color}
							on:click={() => (profileBgColor = color)}
						/>
					{/each}
				</div>
				<div class="relative flex justify-center">
					<label
						for="color-input"
						class="block p-1 rounded-full m-auto cursor-pointer z-10 text-center shadow-md border-2 dark:border-gray-300"
						style:background={profileBgColor}>✏️</label
					>
					<input
						id="color-input"
						class="w-0 h-0 absolute"
						type="color"
						bind:value={profileBgColor}
					/>
				</div>
			</div>
		</section>
		<section class="text-center max-w-lg">
			<h2>Text color</h2>
			<code>{profileTextColor}</code>
			<div class="p-4">
				<div class="overflow-y-auto overflow-x-hidden max-h-24">
					{#each textColorPreset as color}
						<button
							class="w-8 h-6 m-1 rounded-full cursor-pointer shadow-md border-2 dark:border-gray-300"
							style:background={color}
							on:click={() => (profileTextColor = color)}
						/>
					{/each}
				</div>
				<div class="relative flex justify-center">
					<label
						for="text-color-input"
						class="block p-1 rounded-full m-auto cursor-pointer shadow-md border-2 dark:border-gray-300 z-10 text-center"
						style:background-color={profileTextColor}>✏️</label
					>
					<input
						id="text-color-input"
						class="w-0 h-0 absolute"
						type="color"
						bind:value={profileTextColor}
					/>
				</div>
			</div>
		</section>
		<section class="text-center max-w-lg">
			<h2>Font Family</h2>
			<div class="p-4">
				<input
					type="text"
					list="font-family"
					class="input input-bordered input-primary"
					bind:value={profileFontFamily}
					on:change={onFontChange}
				/>
				<datalist id="font-family">
					<option value="Inter" />
					<option value="Sarabun" />
					<option value="Inconsolata" />
					<option value="Comfortaa" />
					<option value="Public Sans" />
				</datalist>
				<p class="text-sm m-3">
					Use the name of the font on google font, or use font name on your local installed font. <br/>Key: <code
						>Open Sans Condensed:300,700:latin,greek</code
					>
				</p>
				{#if isLoadingFont}
					กำลังโหลดฟอนต์...
				{/if}
				<details class="text-left max-w-[200px] m-auto">
					<summary>Fonts log</summary>
					<ul class="font-mono max-h-20 overflow-y-auto">
						{#each fontsStatus as { status, name }}
							<li class="">
								- {status}: {name}
							</li>
						{/each}
					</ul>
				</details>
			</div>
		</section>
	</div>
	<footer class="text-center">
		<p>
			Create for using by myself, <a href="https://www.github.com/ptsgrn">ptsgrn</a>, and think it's
			cool to share.
		</p>
		<select data-choose-theme class="select select-sm capitalize">
			<option value="">Default</option>
			{#each availableThemes as themeName}
				<option value={themeName} class="capitalize">{themeName}</option>
			{/each}
		</select>
	</footer>
</main>
