---
title: 'Two messengers, one app: how I stopped living with the pain'
description: 'My company runs two LAN messengers that cannot talk to each other. Instead of putting up with it, I reverse-engineered both protocols and built one app that speaks both.'
pubDate: 'Nov 03 2026'
---

At work we have two LAN messengers: **[BeeBEEP](https://www.beebeep.net/)**
and **[LAN Messenger](https://github.com/lanmessenger/lanmessenger)**. Both are
serverless, peer-to-peer chat apps that find each other on the local network.
Some people use one, some people use the other, and the two cannot talk to each
other at all.

So you end up with two apps in the tray. Two contact lists. Two places a message
might be waiting for you. You have to remember who's on which. And everyone just
accepts it, because that's the way it has always been.

For a long time I accepted it too. This post is about the moment I stopped.

## Pain is information

What I learned from this project is that a recurring annoyance tells you
something. When you hit the same friction every day, that friction is a spec
waiting to be written.

I used to treat the tools I was given as fixed: they work the way they work and
my job is to adapt. But both of these messengers are open source. The protocols
aren't secret, they're just undocumented. Nothing was stopping me from
understanding them except the assumption that this wasn't my problem to fix.

Once I saw it that way, the question changed. It went from "how do I live with
two apps?" to "what would it take to build one app that speaks both?"

## Learning networking the hard way

I didn't really know networking before this. I knew what an IP address was, and
that was about it. Building a real peer for two protocols changed that fast.

I started by reading the original source of both apps and writing down what I
found before writing any networking code. Both are C++/Qt projects:
[BeeBEEP's source is on SourceForge](https://sourceforge.net/projects/beebeep/)
and [LAN Messenger's is on GitHub](https://github.com/lanmessenger/lanmessenger).

The first rule of the project, recorded as a decision on day one, was
**codec before network**.

> **What's a codec?** Short for *coder/decoder*. Programs on a network don't
> send objects to each other, they send raw bytes, and both sides must agree
> exactly how those bytes are laid out. A codec is the code that turns a
> message like `{ type: chat, from: "Leonardo", text: "hi" }` into the exact
> bytes the other app expects (encoding), and turns incoming bytes back into a
> structured message (decoding). It doesn't open connections or find peers;
> it only knows the format. It's the same idea as video and audio codecs like
> H.264 or MP3: rules for turning data into bytes and back.

So the first step was to get the byte format right in tests, with real
captured messages, and only then open a socket. Network bugs are hard to
debug, but format bugs are easy to test once the network is out of the
picture.

That turned out to be a very good call, because the two protocols are nothing
alike.

**LAN Messenger** sends datagrams with a fixed 6-byte type prefix (`BRDCST`,
`PUBKEY`, `HNDSHK`, `MESSAG`), followed by an XML payload. Peers announce
themselves by broadcast, swap public keys, and then chat over TCP using RSA plus
AES.

**BeeBEEP** sends UTF-8 text envelopes whose fields are separated by the Unicode
paragraph separator (`U+2029`), with the inner data split by the line separator
(`U+2028`). Discovery runs over UDP on port 36475 with multicast; chat runs over
TCP on 6475. Peers agree on a key with elliptic-curve Diffie-Hellman on the
`sect163k1` curve, run the shared point through SHA-1, and encrypt with
AES-256-ECB. Some messages are also wrapped in Qt's compression format.

Along the way I had to get comfortable with things that used to be just
buzzwords to me: broadcast vs. multicast, UDP vs. TCP, framing a byte stream so
you know where one message ends, endianness, and key exchange. I also learned
how to read a packet capture and trust what's on the wire over what I *think*
should be there.

## The bug that taught me the most

My BeeBEEP engine worked perfectly in loopback. Two copies of my TypeScript
client found each other, said hello, swapped keys and chatted. I felt done.

Then I pointed it at a real BeeBEEP 5.8.6 on the network and got... nothing.
`No BeeBEEP users found.` The original app *was* seeing my announcement and
dialing back, but the connection died right away.

Loopback had given me a false sense of being ready. Two copies of my own code
agreed with each other perfectly, because they shared the same wrong
assumptions.

Capturing the real handshake and digging back into the original source turned
up two things:

1. **Framing.** Before the protocol version is negotiated, the original app
   uses a 16-bit length prefix. It only switches to 32-bit after the hello. I
   was using 32-bit from the start. The original read my length as zero and
   waited forever. I read its length as roughly 26 MB and dropped the
   connection.
2. **The hello key.** Thanks to an inverted comparison in the original code
   (with a `"What the hell..."` comment right next to it), the very first
   message is encrypted with an AES key made of 32 zero bytes, not the derived
   key. When I decrypted the captured hello with a zeroed key, a perfectly
   valid `BEE-CIAO 95` came out.

After those two fixes, my app showed up in the original BeeBEEP's contact list,
and its users showed up in mine. That was a great moment. It was also the
moment I understood that **compatibility is proven against the real thing, not
against yourself**. Every real capture since then has gone into the test suite
as a fixture.

## One UI for both networks

With both engines working, I built the part people actually see: an
**Electron desktop app** that speaks both protocols at the same time.

The architecture is in layers, and each layer only knows about the one below
it:

```
codec → protocol engine → adapter → unified client → UI
```

The UI never asks "is this BeeBEEP or LAN Messenger?" Each network plugs in
through an adapter that turns its contacts, presence and messages into one
shared domain model. Each network also declares what it supports (receipts,
groups, file transfer...), so the interface can hide what a protocol doesn't
have without `if (protocol === ...)` scattered everywhere. Adding a third
protocol later means writing a new adapter and nothing else.

It's a **client, not a bridge**. A BeeBEEP contact is always talked to over
BeeBEEP, and a LAN Messenger contact over LAN Messenger. The app doesn't
translate between them. It simply shows up on both networks at once, so nobody
has to switch anything for it to work. The colleague still running the original
BeeBEEP or LAN Messenger can reach me, and I can reach them.

In the interface, both networks live in one contact list, as collapsible
sections with their own unread counters. **BeeBEEP comes first and is the
default**, because it's the more modern and better maintained of the two: it
has real key exchange, delivery and read receipts, and an offline queue that
sends your messages once the other person reconnects. LAN Messenger is still
fully there for everyone who uses it.

I also made sure one broken network can't take down the other. If LAN
Messenger can't open its sockets, BeeBEEP keeps working and the UI tells you
which network is unavailable instead of failing completely.

The rest is the polish I always wanted from the originals: light, dark and
system themes, an interface in Portuguese, search across all contacts, unread
highlights, and a title bar built into the app.

## The final product

The result is **BeeBep LAN Messenger**, a desktop app for Windows and Linux
that:

- appears as a normal peer on **both** BeeBEEP and LAN Messenger networks at the
  same time, with no server and no setup;
- talks to the original BeeBEEP and LAN Messenger clients in both directions,
  tested against real machines on the office network;
- shows every contact from both networks in one list, with presence, unread
  counters and search;
- supports direct messages, delivery and read receipts (where the protocol
  has them), and an offline queue on BeeBEEP;
- keeps working on one network if the other fails to start.

The code is a TypeScript monorepo, one package per layer (codec, engine,
adapter, unified client, desktop app), with a test suite built from real wire
captures:
**[github.com/Lmedeiros-leiman/LanMessaging-BeeBeepLanMessenger](https://github.com/Lmedeiros-leiman/LanMessaging-BeeBeepLanMessenger)**

### Tools I used

- **[TypeScript](https://www.typescriptlang.org/)** on
  **[Node.js 24](https://nodejs.org/)** for everything: codecs, engines and the
  app. It uses Node's built-in `node:dgram` (UDP), `node:net` (TCP),
  `node:crypto` and the `node:test` test runner.
- **[Electron](https://www.electronjs.org/)** for the desktop app, with plain
  HTML, CSS and TypeScript for the interface (no UI framework).
- **[Effect](https://effect.website/)** for typed errors at the domain
  boundaries, so every failure has a name and a shape instead of a random
  `throw`.
- **[esbuild](https://esbuild.github.io/)** to bundle the desktop app.
- **[GitHub Actions](https://github.com/features/actions)** to run the tests
  and an Electron smoke test on every pull request.
- The original **[BeeBEEP](https://sourceforge.net/projects/beebeep/)** and
  **[LAN Messenger](https://github.com/lanmessenger/lanmessenger)** source code
  as the reference spec, plus packet captures from the real apps.

## What's next

The next milestone is feature parity: local message history (SQLite, keyed by
contact and never by IP), file transfer, and groups. After that comes the part
I'm most excited about: themes, an editable UI, and a plugin API, so the app
becomes a platform and not just another closed messenger.

## The real lesson

The networking knowledge is great, and I'll carry it into everything I build.
But the bigger change is in how I look at things. That "this is just how it is"
feeling is often wrong. If something annoys you every day and you have the
source, the docs, or even just the packets, you're not stuck with it.

You can fix it. I did.
