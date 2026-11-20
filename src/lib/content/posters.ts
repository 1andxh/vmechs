/**
 * What a homepage poster lists under its divider (ADR 0016): up to two open
 * pages as links, then one line about the rest. The list never runs past
 * three lines, so the dividers line up across the posters.
 */
export interface PosterLink {
	title: string;
	href: string;
}

/** The most open pages a poster links to; the rest are counted. */
const MAX_LINKS = 2;

export function posterList(
	open: PosterLink[],
	planned: number
): { links: PosterLink[]; more: { text: string; href: string | null } | null } {
	const links = open.slice(0, MAX_LINKS);
	// More open pages than fit: count them and point to "Open now", which lists them all.
	if (open.length > MAX_LINKS)
		return { links, more: { text: `${open.length - MAX_LINKS} more open`, href: '#open-title' } };
	const coming = planned - open.length;
	if (coming <= 0) return { links, more: null };
	return {
		links,
		more: { text: open.length ? `${coming} more on the way` : `${coming} on the way`, href: null }
	};
}
