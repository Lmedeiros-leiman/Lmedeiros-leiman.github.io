import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkMarkdown } from './check-writing.mjs';

const rulesIn = (md) => checkMarkdown(md).paragraphs.flatMap((p) => p.hits.map((h) => h.rule));

test('announcing a realisation before stating it is flagged', () => {
	assert.deepEqual(
		rulesIn('Then I realised something that changed the whole plan. The other computer never sees the code.'),
		['announce'],
	);
	assert.deepEqual(rulesIn('Then came the day I chatted with both apps from one window.'), ['announce']);
	assert.deepEqual(rulesIn('The speed surprised me even more. More changed in a few weeks than in months.'), ['announce']);
});

test('a "what X was" opener that delays the point is flagged', () => {
	assert.deepEqual(rulesIn('What changed my mind was that it had to prove every change.'), ['pseudo-cleft']);
	assert.deepEqual(rulesIn('But what stuck with me most is how close I came to never starting.'), ['pseudo-cleft']);
});

test('setting up a wrong idea only to knock it down is flagged', () => {
	assert.deepEqual(
		rulesIn("It wouldn't be a bridge between the two networks. It would be a real member of both."),
		['contrast'],
	);
	assert.deepEqual(rulesIn('It is not just a chat app, but a tool for the whole office.'), ['contrast']);
});

test('foreshadowing asides are flagged', () => {
	assert.deepEqual(rulesIn('BeeBEEP locks the hello with a key. Remember that. It comes back later.'), ['foreshadow']);
});

test('a short And/But/So punchline closing a paragraph is flagged', () => {
	assert.deepEqual(
		rulesIn('Every step is a message. The other computer never sees the code. The apps treat it as one of their own. And I didn\'t need C++ to do that.'),
		['kicker'],
	);
});

test('em dashes are flagged', () => {
	assert.deepEqual(rulesIn('The app joined both networks — as a member.'), ['dash']);
});

test('the rewritten, direct versions pass', () => {
	assert.deepEqual(
		rulesIn(
			'Every step in the last few sections is a message on the network, and the other computer never sees the code that produced it. If my program sends the same bytes, in the same order, the original apps treat it as one of their own. So my app could join both networks as a member, and I didn\'t need C++ to build it.',
		),
		[],
	);
	assert.deepEqual(rulesIn('Instead, it had to prove every change. Each one came with a test.'), []);
	assert.deepEqual(rulesIn('Then I did the same for BeeBEEP.'), []);
	assert.deepEqual(rulesIn('The tests checked my app against recordings of the real apps, not against itself.'), []);
});

test('frontmatter, headings, code, images and allowed paragraphs are not checked', () => {
	const md = [
		'---',
		"title: 'Then I realised something'",
		'---',
		'',
		'## Then came the day',
		'',
		'```',
		'Then I realised something that changed the whole plan.',
		'```',
		'',
		'![Then came the day](./x.png)',
		'',
		'<!-- writing-check: allow announce -->',
		'Then came the day I chatted with both apps.',
	].join('\n');
	assert.deepEqual(rulesIn(md), []);
});

test('soft markers raise the score; concrete detail is counted', () => {
	const [vague] = checkMarkdown('Honestly, it was a really crucial journey that truly showcased everything.').paragraphs;
	const [concrete] = checkMarkdown('LAN Messenger listens on UDP port 50000 and BeeBEEP on 36475.').paragraphs;
	assert.ok(vague.softPer100 > 30, `vague paragraph scored ${vague.softPer100}`);
	assert.equal(concrete.softPer100, 0);
	assert.ok(concrete.concretePer100 > vague.concretePer100);
});

test('document stats report sentence-length variation and repeated openers', () => {
	const md = ['Then it ran.', 'Then it stopped.', 'Then it ran again and kept going for a long while after that.'].join('\n\n');
	const { doc } = checkMarkdown(md);
	assert.equal(doc.openers.Then, 3);
	assert.ok(doc.sentenceLengthCv > 0);
});

test('a closing question is not a punchline', () => {
	assert.deepEqual(
		rulesIn('How do they find each other? How do they say hello? How do they lock a message? And how do files travel?'),
		[],
	);
});

test('a plain story paragraph with no numbers is not called vague; padding plus no detail is', () => {
	const [story] = checkMarkdown(
		'So I had both open all day. Before writing to someone I had to remember which app they used. Everybody worked like that, and nobody questioned it. That is just how it was, for everyone in the office, every day.',
	).paragraphs;
	assert.equal(story.vague, false);
	const [padded] = checkMarkdown(
		'Honestly, it was really a crucial part of the whole thing, and it truly mattered in a way that is hard to put into words, because everything about it was basically different from what came before and what came after it.',
	).paragraphs;
	assert.equal(padded.vague, true);
});

test('literal "unlock" is fine; the figurative cliché is not', () => {
	assert.equal(checkMarkdown('When it arrives, the receiver unlocks it and shows it.').paragraphs[0].softPer100, 0);
	assert.ok(checkMarkdown('This app will unlock new potential for the team.').paragraphs[0].softPer100 > 0);
});

test('bold and italics in prose are flagged; code and snake_case are not', () => {
	assert.deepEqual(rulesIn('It was the **only** way to make it work.'), ['emphasis']);
	assert.deepEqual(rulesIn('It was the *only* way, and _nobody_ knew.'), ['emphasis']);
	assert.deepEqual(rulesIn('The `read_receipt` field and file_id stay as they are, 2*3*4 too.'), []);
});

test('more forms of setting up a wrong idea to knock it down', () => {
	assert.deepEqual(rulesIn("That's not a spec. It's a sentence."), ['contrast']);
	assert.deepEqual(rulesIn("That's the kind of call I want to be making. Not how to move a branch, but whether to."), ['contrast']);
	assert.deepEqual(rulesIn('Testing against myself proved nothing.'), []);
});

test('"something clicked" announces; a repeated-verb I-contrast knocks down a straw man', () => {
	assert.deepEqual(rulesIn('Somewhere in the middle of those notes, something clicked. The other computer never sees the app.'), ['announce']);
	assert.deepEqual(rulesIn("I didn't learn to trust it blindly. I learned to trust it like a fast colleague."), ['contrast']);
	assert.deepEqual(rulesIn("I didn't trust it. I checked everything it wrote."), []);
	assert.deepEqual(rulesIn("I didn't expect much. I expected to spend my time fixing what it got wrong."), []);
});

test('a negated "came from" answered by "It came from" is a contrast', () => {
	assert.deepEqual(rulesIn("Trust didn't come from the AI getting better. It came from me understanding the problem."), ['contrast']);
	assert.deepEqual(rulesIn("The message didn't come from my app. Ana sent it from her desk."), []);
});
