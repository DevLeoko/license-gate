export function formatDateRelative(date?: Date) {
	if (!date) {
		return 'Never'
	}

	const now = new Date().getTime()
	const diffInSeconds = Math.floor((now - date.getTime()) / 1000)
	const diffInMinutes = Math.floor(diffInSeconds / 60)
	const diffInHours = Math.floor(diffInMinutes / 60)
	const diffInDays = Math.floor(diffInHours / 24)

	if (diffInMinutes < 120) {
		return `${diffInMinutes} min ago`
	} else if (diffInHours < 48) {
		return `${diffInHours} hours ago`
	} else if (diffInDays < 30) {
		return `${diffInDays} days ago`
	} else {
		return date.toLocaleDateString()
	}
}
