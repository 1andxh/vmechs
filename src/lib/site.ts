/** Site-wide constants. Change `url` here when vmechs moves to its own domain. */
export const SITE = {
	name: 'vmechs',
	url: 'https://vmechs.sandoh-dev.workers.dev',
	repo: 'https://github.com/1andxh/vmechs'
} as const;

/**
 * A "Report a mistake" link: opens the repo's issue form with the lesson's
 * address already filled in. (The form's `lesson` field is prefilled by name.)
 */
export function reportMistakeUrl(lessonPath: string, lessonTitle: string): string {
	const params = new URLSearchParams({
		template: 'report-a-mistake.yml',
		title: `Mistake in "${lessonTitle}"`,
		lesson: SITE.url + lessonPath
	});
	return `${SITE.repo}/issues/new?${params}`;
}
