---
title: 'Two messengers, one app'
description: 'My company used two chat apps that could not talk to each other. This is how I built one app that talks to both.'
pubDate: 'Nov 03 2026'
---

At work we use two chat apps for the office network:
**[BeeBEEP](https://www.beebeep.net/)** and
**[LAN Messenger](https://github.com/lanmessenger/lanmessenger)**. Some people
are on one, some are on the other, and the two can't talk to each other.

So I had both open all day. Two icons in the corner of the screen, two contact
lists, two places a message could be hiding. Before writing to someone I had
to remember which app they used. Everybody worked like that, and nobody
questioned it. That's just how it was.

It bothered me every single day. Eventually I got tired of being bothered and
decided to see if I could do something about it.

## A weekend project

This was never a work task. I built it slowly, on the side, mostly on
weekends.

And at first, my interest was low. Most of the people I needed to talk to sat
near me, so whenever the two apps got in the way, I just got up and talked to
them in person. That short-circuited the whole problem, and the project sat
there moving at weekend speed.

What changed was the project itself. Every piece I got working made the two
apps on my screen more annoying, because now I could see how close I was to
getting rid of one of them. The closer it got to something I could actually
use every day, the less patience I had for the old way. That annoyance is what
kept me coming back to it.

## Looking inside

Both apps are open source, so the first thing I did was download their code
and start reading. I wanted to know one thing: when one of these apps sends
"hi" to another computer, what *exactly* goes over the network?

That code is written in C++, a language I'm not comfortable with. Reading it
was slow. I took notes on everything: how each app announces "I'm here" to the
other computers, how they start a conversation, how they wrap up a message
before sending it. Little by little, I had a description of each app's
"language".

That's when I realised something that changed the whole plan. The other
computer never sees the code, only the messages. If my program sends exactly
the same messages, the original apps can't tell it's not one of them. So I
didn't need to write C++ at all.

I did try. I spent some time learning C++, and I tried QML, the language Qt
uses for its interfaces. But JavaScript was already familiar to me, and it's
what the company already uses. On top of that, everything about these apps was
confusing at the start, and in JavaScript I could map out the big ideas first
without getting lost in the details.

Now that I understand how it all works, I could map it out in Rust or C++ if I
wanted. Especially with AI around, since that kind of rewrite is easy but
repetitive work that needs a lot of brute force, which is exactly what AI is
good at.

## Learning the language before talking

I started with LAN Messenger, and I made myself one rule: no talking
to the network until I could write and read its messages perfectly on my own
computer.

So the first piece I built was a translator. It takes a message like "Leonardo
says hi" and turns it into exactly what LAN Messenger expects to receive, and
it does the reverse for incoming messages. (Programmers call this a *codec*,
short for coder/decoder.) I tested it against real messages until it got every
one of them right.

Only then did I connect it to the real network. Eventually I had a small
desktop window where LAN Messenger contacts showed up, and I sent a message
to another computer on the network running the original app. It arrived.

## The day it didn't work

Then I did the same for BeeBEEP. I built it, and to test it I ran two copies of
my own program. They found each other, said hello and chatted. I thought I was
done.

So I tried it with a real BeeBEEP on the office network, and got nothing.
The real app could see mine and tried to say hello, but the conversation died
on the spot.

The problem was that my two copies agreed with each other because they had
the same mistakes. Testing against myself proved nothing.

So I recorded what the real BeeBEEP was sending and compared it against its
code, line by line. I found two surprises. The very first message has a
different size label from every message after it. And that first message is
locked with an empty key, because of a bug in the original code that sits
right next to a comment that literally says `"What the hell..."`.

I copied both quirks exactly. The next time I ran it, my program showed up in
the real BeeBEEP's contact list, and its people showed up in mine.

## Putting it together

With both working, I put them into one desktop app, and the window is where
the original problem finally went away:

- One contact list, with a section for BeeBEEP people and one for LAN
  Messenger people, plus search across both.
- **BeeBEEP comes first and is the default**, because it's the better of the
  two. LAN Messenger is still fully there for whoever uses it.
- My app shows up in both networks at once, so nobody else has to install
  anything or change anything. If you still use the original BeeBEEP or LAN
  Messenger, you can reach me and I can reach you.
- If one of the networks has a problem, the other keeps working.

Then came the day I chatted with both original apps on another computer
in both directions, from the same window. The two icons in the corner became
one.

The code is on GitHub:
**[github.com/Lmedeiros-leiman/LanMessaging-BeeBeepLanMessenger](https://github.com/Lmedeiros-leiman/LanMessaging-BeeBeepLanMessenger)**

## Looking back

I came out of this knowing far more about how computers talk to each other
than I did when I started, and I learned all of it by needing it.

But what stuck with me most is how close I came to never starting. "It's just
how it is" felt true for a long time, and it wasn't. The apps were open and
their messages could be recorded. That was enough to start.

So if something bugs you every day, look inside it. You might be able to fix
it too.
