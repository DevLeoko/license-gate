<script lang="ts">
	import hljs from 'highlight.js'
	import 'highlight.js/styles/github.css'
	import { onMount } from 'svelte'
	import { logInfo } from '../../stores/alerts'

	let element: HTMLElement
	let sourceElement: HTMLElement

	export let language: undefined | string = undefined

	let className = ''

	export { className as class }

	onMount(() => {
		// Observe sourceElement for changes and update element accordingly

		const observer = new MutationObserver(() => {
			element.innerHTML = sourceElement.innerHTML || ''
			element.dataset.highlighted = ''
			hljs.highlightElement(element)
		})

		element.innerHTML = sourceElement.innerHTML || ''
		hljs.highlightElement(element)

		observer.observe(sourceElement, {
			childList: true,
			subtree: true,
			characterData: true,
		})

		return () => observer.disconnect()
	})

	function copyCode() {
		navigator.clipboard.writeText(sourceElement.textContent || '')

		logInfo('Copied to clipboard')
	}
</script>

<div class="relative {className}">
	<pre><code class="!pr-12 {language ? `language-${language}` : ''}" bind:this={element} /></pre>
	<div class="hidden" bind:this={sourceElement}>
		<slot />
	</div>

	<span
		class="absolute text-base text-gray-500 bg-white rounded-full cursor-pointer material-icons top-4 right-4"
		style="box-shadow: 0 0 5px 5px #fff"
		on:click={copyCode}
	>
		content_copy
	</span>
</div>
