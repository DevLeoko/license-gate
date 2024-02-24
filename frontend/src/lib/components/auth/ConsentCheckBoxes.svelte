<script lang="ts">
	export let agreedToTerms = false
	export let agreedToMarketing = false
</script>

<!-- ToS and Marketing checkbox -->
<div class="leading-tight">
	<div class="flex items-center mt-2">
		<input
			type="checkbox"
			id="terms-checkbox"
			class="w-4 h-4 mr-1 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
			bind:checked={agreedToTerms}
		/><span class="mr-1 text-sm text-red-500">*</span>
		<label for="terms-checkbox">
			<div>&nbsp;</div>
			<span class="text-sm text-gray-500">
				By signing up, you agree to the
				<a class="text-blue-500" href="https://licensegate.io/legal/tos" target="_blank"
					>Terms Of Service</a
				>
				and
				<a class="text-blue-500" href="https://licensegate.io/legal/privacy-policy" target="_blank"
					>Privacy Policy</a
				>
			</span>
		</label>
	</div>

	<div class="flex items-center mt-2">
		<input
			type="checkbox"
			id="marketing-checkbox"
			class="w-4 h-4 mr-2 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
			bind:checked={agreedToMarketing}
		/>
		<label for="marketing-checkbox" class="text-sm text-gray-500"
			>I want to receive emails about new features and updates</label
		>
	</div>
</div>
