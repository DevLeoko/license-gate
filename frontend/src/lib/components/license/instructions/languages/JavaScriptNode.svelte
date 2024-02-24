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

<TabbedCard options={['axios', 'node-fetch']} selected="axios" let:selected>
	<Code language="javascript">
		{#if selected === 'axios'}
			{`const axios = require('axios');

const url = "${PUBLIC_BACKEND_URL}/license/${$userId}/${exampleLicense}/verify${scopeArg}";
axios.get(url)
  .then(response => {
      const data = response.data;
      if (data.valid) {
          // License is valid
      } else {
          // License is invalid
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
`}
		{:else}
			{`const fetch = require('node-fetch');

const url = "${PUBLIC_BACKEND_URL}/license/${$userId}/${exampleLicense}/verify${scopeArg}";
fetch(url)
  .then(response => response.json())
  .then(data => {
      if (data.valid) {
          // License is valid
      } else {
          // License is invalid
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
`}
		{/if}
	</Code>
</TabbedCard>
