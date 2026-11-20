<!--
	The site's footer: the wordmark, a link to About, and the slogan. Shared by
	the homepage and the section pages; a lesson's stage has no footer.
-->
<footer class="foot">
	<span class="wordmark">vmechs</span>
	<span><a href="/about">About</a> · Mechanics made easy. · © 2026</span>
</footer>

<style>
	.foot {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		margin-top: 120px;
		padding-top: 24px;
		border-top: 1px solid var(--line);
		font-size: 14px;
		color: var(--ink-3);
	}
	.wordmark {
		font-size: 18px;
		font-stretch: var(--display-stretch);
		font-weight: 650;
		letter-spacing: -0.025em;
		color: var(--ink-2);
	}
	a {
		color: var(--ink-2);
	}
	a:hover {
		color: var(--accent);
	}
	@media (max-width: 860px) {
		.foot {
			flex-direction: column;
			margin-top: 80px;
		}
	}
</style>
