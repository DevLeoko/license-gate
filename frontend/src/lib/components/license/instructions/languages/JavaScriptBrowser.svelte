<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { userId } from '../../../../stores/auth'
	import Code from '../../../basics/Code.svelte'

	export let scope: string | undefined = undefined
	export let license: string | undefined = undefined

	$: scopeArg = scope ? `?scope=${encodeURIComponent(scope)}` : ''
	$: exampleLicense = license || 'XXXX-XXXX-XXXX-XXXX'
</script>

<Code language="javascript">
	{`const { valid } = await fetch("${PUBLIC_BACKEND_URL}/license/${$userId}/${exampleLicense}/verify${scopeArg}")
	.then((res) => res.json())

if (valid) {
	// License is valid
} else {
	// License is invalid
}`}
</Code>
