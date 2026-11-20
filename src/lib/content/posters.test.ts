import { describe, it, expect } from 'vitest';
import { posterList } from './posters';

const page = (n: number) => ({ title: `Page ${n}`, href: `/learn/x/page-${n}` });
const pages = (n: number) => Array.from({ length: n }, (_, i) => page(i + 1));

describe('posterList: what a homepage poster lists under its divider', () => {
	it('lists the open pages, then how many more are on the way', () => {
		expect(posterList(pages(2), 19)).toEqual({
			links: pages(2),
			more: { text: '17 more on the way', href: null }
		});
	});

	it('with nothing open yet, says how many are on the way, without "more"', () => {
		expect(posterList([], 4)).toEqual({ links: [], more: { text: '4 on the way', href: null } });
	});

	it('shows at most two links; the rest are "more open", linking to Open now', () => {
		expect(posterList(pages(5), 6)).toEqual({
			links: pages(2),
			more: { text: '3 more open', href: '#open-title' }
		});
	});

	it('says nothing more when every planned page is open and listed', () => {
		expect(posterList(pages(2), 2)).toEqual({ links: pages(2), more: null });
	});
});
