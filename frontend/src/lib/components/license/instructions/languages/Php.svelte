<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { userId } from '../../../../stores/auth'
	import Code from '../../../basics/Code.svelte'

	export let scope: string | undefined = undefined
	export let license: string | undefined = undefined

	$: scopeArg = scope ? `?scope=${encodeURIComponent(scope)}` : ''
	$: exampleLicense = license || 'XXXX-XXXX-XXXX-XXXX'
</script>

<Code language="php">
	{`$url = "${PUBLIC_BACKEND_URL}/license/${$userId}/${exampleLicense}/verify${scopeArg}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);
$data = json_decode($response, true);

if ($data['valid']) {
  // License is valid
} else {
  // License is invalid
}

curl_close($ch);
`}
</Code>
