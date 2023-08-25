<script lang="ts">
	export let date: Date | null

	function onInput(event: Event) {
		const target = event.target as HTMLInputElement
		const value = target.valueAsDate

		if (value) {
			if (date) value.setHours(date.getHours(), date.getMinutes(), date.getSeconds())
			date = value
		}
	}
</script>

<input type="date" value={!date ? '' : date.toISOString().split('T')[0]} on:input={onInput} />
