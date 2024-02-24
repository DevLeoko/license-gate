<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { userId } from '../../../../stores/auth'
	import Code from '../../../basics/Code.svelte'
	import TabbedCard from '../../../basics/TabbedCard.svelte'

	export let scope: string | undefined = undefined
	export let license: string | undefined = undefined

	$: scopeArg = scope ? `?scope=${encodeURIComponent(scope)}` : ''
	$: exampleLicense = license || 'XXXX-XXXX-XXXX-XXXX'
</script>

<TabbedCard options={['requests', 'urllib']} selected="requests" let:selected>
	<Code language="python">
		{#if selected === 'requests'}
			{`import requests

url = "${PUBLIC_BACKEND_URL}/license/${$userId}/${exampleLicense}/verify${scopeArg}"
response = requests.get(url)
data = response.json()

if data['valid']:
  # License is valid
else:
  # License is invalid
`}
		{:else}
			{`import urllib.request
import json

url = "${PUBLIC_BACKEND_URL}/license/${$userId}/${exampleLicense}/verify${scopeArg}"
response = urllib.request.urlopen(url)
data = json.loads(response.read())

if data['valid']:
  # License is valid
else:
  # License is invalid
`}
		{/if}
	</Code>
</TabbedCard>
