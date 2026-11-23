---
name: blog-writing
description: Use when writing, rewriting or editing a post in src/content/blog, or any paragraph of prose for this blog.
---

# Blog writing

Posts here are first person, told in order, for curious readers who are not
necessarily programmers. Every paragraph is plain: it starts with its fact and
ends on its last fact.

## The shape of a paragraph

1. The first sentence is the fact, the event or the realisation itself.
2. The middle sentences add concrete detail: what happened, a number, a name,
   what went over the wire, what I saw on screen.
3. The last sentence is the last fact. The paragraph stops there.

Say what a thing is. Mention an alternative only when a reader would really
have assumed it, and then in the same sentence ("the tests checked my app
against the real apps, not against itself").

## Rewrites

| Formula (what `check:writing` flags) | Plain version |
|---|---|
| Then I realised something that changed the whole plan. The other computer never sees the code. | The other computer never sees the code, only the messages. |
| What changed my mind was that it had to prove every change. | It had to prove every change. |
| It wouldn't be a bridge between the networks. It would be a member of both. | My app could join both networks as a member. |
| Remember that. It comes back later. | (cut; explain it where it matters) |
| …the apps treat it as one of their own. And I didn't need C++. | …the apps treat it as one of their own, so I didn't need C++. |
| Then came the day I chatted with both apps. | I chatted with both apps from the same window. |
| It was the **only** way. | It was the only way. |

## Check before every pull request

Run the checker on each post you touched and fix every `✖` line:

```
npm run check:writing -- src/content/blog/<post>.md
```

`⚠ padded` and `⚠ vague` lines are judgement calls: replace filler words with
the concrete detail they stand in for. A sentence the checker flags that is
genuinely right stays, with `<!-- writing-check: allow <rule> -->` on the line
above its paragraph; say why in the pull request.

Change `scripts/check-writing.mjs` only with a test in
`scripts/check-writing.test.mjs` that shows the new case, and run
`npm run test:writing`.
