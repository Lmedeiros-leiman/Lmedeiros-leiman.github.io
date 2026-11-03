---
title: 'Two messengers, one app: how I stopped living with the pain'
description: 'My company runs two LAN messengers that cannot talk to each other. Instead of putting up with it, I rebuilt both in JavaScript and made one app that speaks both.'
pubDate: 'Nov 03 2026'
---

At work we have two LAN messengers:
**[BeeBEEP](https://www.beebeep.net/)** and
**[LAN Messenger](https://github.com/lanmessenger/lanmessenger)**. Both are
little chat apps that find each other on the office network without any
server. Some people use one, some people use the other, and the two cannot
talk to each other at all.

So you end up with two apps in the tray. Two contact lists. Two places a message
might be waiting for you. You have to remember who's on which. And everyone just
accepts it, because that's the way it has always been.

For a long time I accepted it too. This post is about the moment I stopped.

## Pain is information

What I learned from this project is that a recurring annoyance tells you
something. When you hit the same friction every day, that friction is a to-do
list someone hasn't written yet.

I used to treat the tools I was given as fixed: they work the way they work and
my job is to adapt. But both of these messengers are open source. Nothing was
stopping me from understanding them except the assumption that this wasn't my
problem to fix.

Once I saw it that way, the question changed. It went from "how do I live with
two apps?" to "what would it take to build one app that speaks both?"

## The wall

The honest answer to that question was scary at first.

Both original apps are written in C++ with Qt. That's serious, low-level
stuff: you manage memory by hand, you compile for every platform, and every
small change comes with a lot of ceremony. Reading their source felt like
reading another country's tax law. If the only way to fix this had been to
write C++ like they did, I probably would have closed the tab and gone back to
having two apps open.

Then it clicked: **I don't have to fight in their language.** A protocol is just
an agreement about what bytes go over the wire. It doesn't care what language
produced them. If my program sends the right bytes, the original apps can't
tell the difference.

So I used the tool I'm actually fast with: **JavaScript** (well, TypeScript,
which is JavaScript with type labels on it so my editor catches my mistakes).

## Languages are tools

I think people talk about programming languages like they're teams to
cheer for. They're not. They're tools, and the right one is the one that gets
*you* from the problem to the solution.

C++ gives you total control, and the original authors needed that control.
JavaScript takes most of it away, and in exchange it hands you abstractions.
For someone like me, that trade was the whole reason this project was possible:

- **Networking is a few lines.** Node.js comes with built-in modules for
  sending messages across the network. Listening for other computers on the
  office network is a function call, not a weekend of setting up libraries.
- **Encryption is built in.** Both protocols encrypt their messages. In
  JavaScript the crypto toolbox ships with the runtime, so I could focus on
  *what* the apps were doing instead of *how* to make my compiler happy.
- **The UI is just a web page.** With [Electron](https://www.electronjs.org/),
  the desktop app is HTML and CSS, the same things I'd use for a website. No
  new UI toolkit to learn.
- **Fast feedback.** Change a line, run it, see what happens. When you're
  poking at a protocol nobody documented, being able to try ten ideas in ten
  minutes matters more than anything else.

Is JavaScript the "best" language? No. Is it the one that let a person who
didn't really know networking pull this off? Absolutely. The abstraction
hid the boring, dangerous parts and left me with only the interesting
question: *what are these two apps saying to each other?*

## Learning the network by listening to it

I didn't know networking before this. I knew what an IP address was, and that
was about it. I learned by doing it the slow way: reading the original source,
writing down what I found, and listening to what the real apps sent on the
network.

The first rule I set for the project was **codec before network**.

> **What's a codec?** Short for *coder/decoder*. Programs on a network don't
> send objects to each other, they send raw bytes, and both sides must agree
> exactly how those bytes are laid out. A codec is the code that turns a
> message like `{ from: "Leonardo", text: "hi" }` into the exact bytes the
> other app expects, and turns incoming bytes back into a message. It doesn't
> connect to anything; it only knows the format. It's the same idea as video
> and audio codecs like MP3: rules for turning data into bytes and back.

In other words: first learn to speak the language correctly, and only then
start talking to people. Getting the format right on my own machine was easy
to test. Getting it wrong over a real network is a nightmare to debug.

And the two apps speak very different languages. One wraps its messages in
XML. The other uses text fields separated by invisible Unicode characters. Both
encrypt everything in their own way. Each one was a small puzzle, and every
solved puzzle taught me another piece of how networks really work.

## The day it didn't work

My first BeeBEEP version worked perfectly... with itself. Two copies of my app
found each other, said hello and chatted. I felt done.

Then I pointed it at a real BeeBEEP on the office network and got nothing.
The original app *could* see me, tried to say hello, and the conversation
died right away.

Two copies of my own code agreed with each other perfectly, because they shared
the same wrong assumptions.

So I recorded what the real app was actually sending and compared it to the
original source, line by line. It turned out that the very first message
follows different rules from all the others: a different size header, and
(thanks to a bug in the original code, sitting right next to a comment that
literally says `"What the hell..."`) a blank encryption key. Once I matched
those quirks exactly, my app showed up in the original BeeBEEP's contact list,
and its users showed up in mine.

That was a great moment, and it came with the most important lesson of the
project: **you prove you're compatible by testing against the real thing, not
against yourself.**

## The final product

The result is **BeeBep LAN Messenger**, one desktop app that:

- shows up on **both** networks at the same time, with no server and no setup;
- chats with people still using the original BeeBEEP or LAN Messenger, in both
  directions, so nobody else has to change anything;
- puts every contact from both networks in one list, with who's online,
  unread counters and search;
- **defaults to BeeBEEP**, the better of the two, while keeping LAN Messenger
  fully there for whoever uses it;
- keeps working on one network even if the other one breaks.

It's not a bridge that translates between the two. It's simply one person who
speaks both languages, sitting in both rooms at once.

The code is on GitHub:
**[github.com/Lmedeiros-leiman/LanMessaging-BeeBeepLanMessenger](https://github.com/Lmedeiros-leiman/LanMessaging-BeeBeepLanMessenger)**

## The real lesson

I came out of this knowing a lot more about networks, and that knowledge will
stay with me. But two other things changed more.

First, that "this is just how it is" feeling is often wrong. If something
annoys you every day and you can get at the source, or even just watch what
it sends, you're not stuck with it.

Second, you don't need the "proper" tool to fix it. You need the tool *you* can
move fast with. For me that was JavaScript: simpler, more abstract, and good
enough to stand right next to two C++ apps and speak their language.

You can fix it. I did.
