---
name: blog-writing
description: Use when writing, rewriting or editing a post in src/content/blog, or any paragraph of prose for this blog.
---

# Blog writing

Posts here are first person, told in order, for curious readers who are not
necessarily programmers. Every paragraph is plain: it starts with its fact and
ends on its last fact. Keep the author's own phrasing and jokes; fix their
grammar, not their voice.

## The shape of a paragraph

1. The first sentence is the fact, the event or the realisation itself.
2. The middle sentences add concrete detail: what happened, a number, a name,
   what went over the wire, what I saw on screen.
3. The last sentence is the last fact. The paragraph stops there.

Say what a thing is. Mention an alternative only when a reader would really
have assumed it, and then in the same sentence ("the tests checked my app
against the real apps, not against itself").

## Explaining something technical

1. The idea in plain words: what the thing is for, what it is good and bad at.
2. One concrete example per app, a sentence or two each.
3. Stop there. Ports, addresses, field lists and step-by-step exchanges belong
   in the diagram next to the text; the prose says what the diagram can't.

Define a term in the paragraph that first needs it.

Before:

> UDP sends single, standalone messages. There is no connection, and no
> promise that a message arrives. TCP opens a connection between two
> computers… A call can go out as a broadcast… or as a multicast… LAN
> Messenger calls out on UDP port 50000, to the multicast group
> 239.255.100.100 and as a broadcast… BeeBEEP calls out on UDP port 36475, to
> the multicast group 224.0.64.75…

After:

> TCP opens a connection between two computers, and everything sent on it
> arrives complete and in order. UDP fires off a single message with no
> connection and no promise that it lands. That's fine for a quick shout to
> the whole network, and no good for anything that has to arrive. So both apps
> use UDP only to say "I'm here", and TCP for everything after that.

## Claims about how the work was done

A sentence that says who did something, when or how ("I read the C++
myself", "by hand", "the AI found it") is a claim about the project's record.
Check it before it goes into a post:

1. Look it up in the record: commit authors and dates, `Co-Authored-By`
   trailers, pull requests, agent session logs.
2. The record confirms it: keep it. The record says otherwise: write what the
   record says, and tell the author what changed and why. The record is
   silent: keep it as the author's memory ("I believe", "I remember").
3. When you can't reach the record, send the polished text together with a
   list of the claims you couldn't check, and ask the author about each one.

Technical claims get the same treatment against the original apps' source.
Use the plain word that is still exact: TCP is reliable, not secure.

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

Work on a branch from `main`, and show the author the local preview
(`astro dev --background`) before opening the pull request.

Read the whole post once, top to bottom. Each idea and each person or tool
appears for the first time in one place, the sections follow the order
things happened, and no point is made twice.

Run the checker on each post you touched and fix every `✖` line. A clean
checker covers sentences, not the post:

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
