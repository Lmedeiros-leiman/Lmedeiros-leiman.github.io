---
title: 'I stopped typing and started directing'
description: 'How I set up this whole blog, from an empty folder to automatic publishing, by getting out of my AI agent''s way and spending my time on the decisions instead.'
pubDate: 'Nov 03 2026'
---

This blog didn't exist this morning. By the end of the day it had a home page,
a first real post that went through nine rounds of edits, and a setup where
anything I approve goes live on its own a minute later.

I wrote almost none of the code. That was the point.

## What I asked for

I opened an empty folder, started my AI coding agent
([Claude Code](https://claude.com/claude-code)), and told it roughly this: I
want a blog on GitHub, every change should go through a pull request, and
merging should publish it automatically.

That's not a spec. It's a sentence. But it said what I cared about: I wanted a
real process, not a folder I edit by hand and forget about. Every change
reviewed, every change recorded, nothing going live by accident.

The agent asked me two questions: which tool to build the site with, and what
to call the repository. I picked [Astro](https://astro.build) and my main
GitHub Pages address. Then I let it run.

## The first decision that mattered

Before building anything, it checked my GitHub account and told me something
I had half forgotten: my old portfolio site was already living at that
address.

This is where an agent that just does what it's told would have caused damage.
Instead it stopped and asked. I decided on the spot: move the old site to its
own branch called "archived", keep all of its history, and start clean.

That's the kind of call I want to be making. Not how to move a branch, but
whether to.

## Watching it work

Then I mostly watched. In order, it:

- built the new site and checked that it worked before going any further;
- wrote the automation that builds every pull request and publishes every
  merge;
- locked the main branch so that nothing, me included, can skip the process;
- pushed it all and waited for the first publish.

The first publish failed. GitHub still had an old rule that only allowed the
old portfolio's branch to publish. The agent read the error, found the rule,
swapped it for the new branch, ran it again, and then opened the live site to
confirm it was really there.

I didn't debug anything. I read a two-line summary of what broke and why.

## The part that was actually mine

Next I asked for a real post about a project of mine, a chat app I built to
merge the two messengers we use at work. The agent read through that whole
project, its notes, its history and its bug reports, and wrote a first draft.

The draft was accurate. It was also not mine. It was full of technical detail,
it lectured the reader every few paragraphs, and it explained why I chose my
tools in a way I never would.

So I edited it, by talking. Too much jargon, tell it as a story. Don't defend
JavaScript, I used it because it's what I needed. Add that I tried C++ and QML
first. Drop the dates. Stop putting random words in bold.

Some of those notes were corrections, not taste. At one point the draft said
our office network was shared between two buildings, which made no sense, and
I said so. The agent didn't argue and didn't guess again. It went into the
source code of both chat apps, checked how they actually reach people on other
networks, and came back with the real answer, plus a gap it found in my own
app along the way.

That's the split I ended up with. It kept every fact straight and checked
everything it wrote against the source. I decided what the story was, how it
should sound, and what was wrong.

## How it works now

Every change to this blog, including this post, goes the same way:

1. The agent writes it on a separate branch.
2. It opens a pull request, and GitHub builds the site to make sure nothing is
   broken.
3. I read it. If I say yes, it gets merged.
4. The merge publishes the site, and the agent checks the live page to confirm
   the change is really there.

Nine pull requests went through that loop on the first day. I didn't type a
single command.

## What I took from it

I used to think of these tools as a faster keyboard. They're closer to a very
fast, very careful colleague who has no opinion about what you're trying to
say. The work still needs someone who knows what they want, notices when
something is off, and makes the calls that can't be undone.

That's the job I kept. Everything else, I let go of, and I spent the time
thinking instead.
