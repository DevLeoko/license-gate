<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { userId } from '../../../stores/auth'
	import Card from '../../basics/Card.svelte'
	import Code from '../../basics/Code.svelte'
	import BackendFrontedSelector from './BackendFrontedSelector.svelte'
	import OptionCard from './OptionCard.svelte'
	import Java from './languages/Java.svelte'
	import JavaScriptBrowser from './languages/JavaScriptBrowser.svelte'
	import JavaScriptNode from './languages/JavaScriptNode.svelte'
	import Php from './languages/Php.svelte'
	import Python from './languages/Python.svelte'

	export const FRONTEND_LANGUAGES = [
		'JavaScript/TypeScript',
		'Python',
		'Java',
		// 'Dart',
		// 'Swift',
		'Other',
	] as const
	export const BACKEND_LANGUAGES = [
		'JavaScript/TypeScript',
		'Python',
		'Java',
		'PHP',
		'Other',
	] as const

	export let scope: string | undefined = undefined
	export let license: string | undefined = undefined
	$: scopeArg = scope ? `?scope=${encodeURIComponent(scope)}` : ''
	$: exampleLicense = license || 'XXXX-XXXX-XXXX-XXXX'

	let backendOrFrontend: 'frontend' | 'backend' | null = null

	$: languages = backendOrFrontend === 'frontend' ? FRONTEND_LANGUAGES : BACKEND_LANGUAGES

	let selectedLanguage: (typeof languages)[number] | null = null

	$: {
		backendOrFrontend
		selectedLanguage = null
	}

	$: isCompiledLanguage = selectedLanguage === 'Java'
</script>

<div class="flex flex-col gap-4">
	<h2 class="text-xl font-semibold">Integrate License Verification</h2>
	<p>
		There are many way you can integrate a License Gate license check into your application. Let's
		find the right one for you!
	</p>

	<h3 class="text-lg font-semibold">Where do you want to integrate the license check?</h3>
	<BackendFrontedSelector bind:selected={backendOrFrontend} />

	{#if backendOrFrontend != null}
		<h3 class="text-lg font-semibold">
			Which programming language are you using in your {backendOrFrontend}?
		</h3>

		<div class="flex gap-2">
			{#each languages as lang}
				<OptionCard
					slim
					title={lang}
					selected={selectedLanguage === lang}
					on:click={() => (selectedLanguage = lang)}
				/>
			{/each}
		</div>

		{#if selectedLanguage != null}
			{#if backendOrFrontend == 'frontend' && selectedLanguage != 'Other'}
				{#if isCompiledLanguage}
					<Card class="text-sm bg-orange-50">
						<p>
							<b class="font-medium">Security notice:</b>
							{selectedLanguage} is a compiled language. While that makes it more complicated to manipulate
							the code, any application running on the client side can be manipulated and the license
							check could be bypassed. <br />
							When used on the client side, we recommend to use our RSA challenge feature for an additional
							layer of security.
						</p>
					</Card>
				{:else}
					<Card class="text-sm bg-red-50">
						<p>
							<b class="font-medium">Security notice:</b>
							{selectedLanguage} is an interpreted language. This makes it easier to manipulate the code
							and bypass the license check. It is not advised to use LicenseGate in {selectedLanguage}
							on the client side for any critical license checks.
						</p>
					</Card>
				{/if}
			{/if}

			{#if selectedLanguage == 'Java'}
				<Java useRsaKey={backendOrFrontend == 'frontend'} {scope} {license} />
			{:else if selectedLanguage == 'Python'}
				<Python {scope} {license} />
			{:else if selectedLanguage == 'PHP'}
				<Php {scope} {license} />
			{:else if selectedLanguage == 'JavaScript/TypeScript'}
				{#if backendOrFrontend == 'frontend'}
					<JavaScriptBrowser {scope} {license} />
				{:else}
					<JavaScriptNode {scope} {license} />
				{/if}
			{:else}
				<Card class="">
					<p>
						We currently only provide examples for the most common languages. However, the process
						is similar for other languages. To verify a license you make a POST or GET request to
						our API with the license key and other optional parameters.
					</p>

					<Code language="http" class="bg-gray-200">
						GET {`${PUBLIC_BACKEND_URL}/license/${$userId}/${exampleLicense}/verify${scopeArg}`}
					</Code>
				</Card>
			{/if}
		{/if}
	{/if}
</div>
