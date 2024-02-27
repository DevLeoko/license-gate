<script lang="ts">
	import { userId } from '../../../../stores/auth'
	import Card from '../../../basics/Card.svelte'
	import Code from '../../../basics/Code.svelte'
	import TabbedCard from '../../../basics/TabbedCard.svelte'

	export let scope: string | undefined = undefined
	export let license: string | undefined = undefined
	export let useRsaKey: boolean = true

	$: scopeArg = scope ? `, "${scope}"` : ''

	$: exampleLicense = license || 'XXXX-XXXX-XXXX-XXXX'

	const REPO_INSTRUCTIONS = {
		['Maven']: `<repository>
  <id>respark-releases</id>
  <name>Respark - Maven Repository</name>
  <url>https://maven.respark.dev/releases</url>
</repository>

<dependency>
  <groupId>dev.respark.licensegate</groupId>
  <artifactId>license-gate</artifactId>
  <version>1.X.X</version>
</dependency>`,
		['Gradle (Kotlin)']: `maven {
    name = "resparkReleases"
    url = uri("https://maven.respark.dev/releases")
}

implementation("dev.respark.licensegate:license-gate:1.X.X")`,
		['Gradle (Groovy)']: `maven {
    name "resparkReleases"
    url "https://maven.respark.dev/releases"
}

implementation "dev.respark.licensegate:license-gate:1.X.X"`,
	}
</script>

<h3 class="text-lg font-semibold">Add as dependency</h3>
<TabbedCard options={['Maven', 'Gradle (Kotlin)', 'Gradle (Groovy)']} selected="Maven" let:selected>
	<Code>
		{selected ? REPO_INSTRUCTIONS[selected] : ''}
	</Code>
</TabbedCard>
<Card class="text-sm bg-gray-50">
	<b>Alternative:</b>
	<p>
		You can also download the JAR file from the <a
			class="text-blue-500"
			href="https://maven.respark.dev/#/releases/dev/respark/licensegate/license-gate/"
			>Maven repository</a
		>
		and add it to your project manually. Or get the <i>LicenseGate.java</i> class from our
		<a
			class="text-blue-500"
			href="https://github.com/DevLeoko/license-gate-java-wrapper/blob/main/src/main/java/dev/respark/licensegate/LicenseGate.java"
			>GitHub repository</a
		>. This class includes all functionality but depends on the <i>jackson</i> library.
	</p>
</Card>

<h3 class="text-lg font-semibold">Verification code</h3>
<TabbedCard options={['Basic', 'Compact', 'Debug']} selected="Basic" let:selected>
	<Code
		>{#if selected === 'Basic'}
			{`${
				useRsaKey
					? `// Your public RSA key (can be found in your settings)
final String PUBLIC_KEY = "-----BEGIN PUBLIC KEY----- MIIB2d/...";

`
					: ''
			}// Initialize the LicenseGate client 
LicenseGate licenseGate = new LicenseGate("${$userId}"${useRsaKey ? `, PUBLIC_KEY` : ''});

// Check a license
LicenseGate.ValidationType result = licenseGate.verify("${exampleLicense}"${scopeArg});

// Handle the result
if (result == LicenseGate.ValidationType.VALID) {
    // License is valid
} else if (result == LicenseGate.ValidationType.EXPIRED) {
    // License is expired (e.g. prompt user to renew)
} else {
    // License is invalid (check documentation for all possible types)
}
`}
		{:else if selected === 'Compact'}
			{`// In just one line
boolean isValid = new LicenseGate("${$userId}")
    .verify("${exampleLicense}"${scopeArg})
    .isValid();
`}
		{:else}
			{`// Having trouble? Enable debug mode
new LicenseGate("${$userId}").debug().verify("${exampleLicense}"${scopeArg})
`}
		{/if}
	</Code>
</TabbedCard>
