<div class="flex w-screen h-screen max-w-full overflow-hidden">
	<div class="flex flex-col flex-grow min-w-0 p-6 pb-4 md:p-12">
		<a class="flex items-center mb-8" href="https://licensegate.io">
			<img class="h-8" src="/logo.svg" alt="logo" />
		</a>

		<div class="max-w-sm">
			<slot />
		</div>

		<div class="z-20 flex flex-wrap gap-4 mt-auto mb-4 text-xs text-gray-700">
			<span>&copy; LicenseGate {new Date().getFullYear()}</span>

			<a
				href="https://licensegate.io/legal/tos"
				class="transition-colors duration-300 text-slate-500 hover:text-blue-500:text-blue-500"
				>Terms of service</a
			>
			<a
				href="https://licensegate.io/legal/privacy-policy"
				class="transition-colors duration-300 text-slate-500 hover:text-blue-500:text-blue-500"
				>Privacy policy</a
			>
			<a
				href="https://licensegate.io/legal/notice"
				class="transition-colors duration-300 text-slate-500 hover:text-blue-500:text-blue-500"
				>Imprint</a
			>
		</div>
	</div>
	<div class="hidden w-1/3 p-8 -mr-12 -skew-x-6 bg-blue-400 bg-center bg-cover md:block" />
</div>
