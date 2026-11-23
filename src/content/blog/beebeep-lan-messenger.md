---
title: 'Two messengers, one app'
description: 'My office used two chat apps that could not talk to each other. How each one works, how I built one app that talks to both, and how I learned to trust AI along the way.'
pubDate: 'Nov 03 2026'
updatedDate: 'Nov 19 2026'
---

At work we use two chat apps for the office network:
[BeeBEEP](https://www.beebeep.net/) and
[LAN Messenger](https://github.com/lanmessenger/lanmessenger). Some people
are on one, some are on the other, and the two can't talk to each other.

So I had both open all day. Two icons in the corner of the screen, two contact
lists, two places a message could be hiding. Before writing to someone I had
to remember which app they used. Everybody worked like that, and nobody
questioned it. That's just how it was.

It bothered me every day, so I started looking for a way to reach everyone from
one app.

## Looking inside

Both apps are open source, so the first thing I did was download their code
and start reading. I wanted to know one thing: when one of these apps sends
"hi" to another computer, what exactly goes over the network?

That code is written in C++, a language I'm not comfortable with. Reading it
was slow. I took notes on everything, and little by little I had a
description of each app's "language".

The next four sections are what those notes say, in plain words. I asked the
same questions of both apps. How do they find each other? How do they say
hello and keep strangers from reading along? What does one message look like?
And how do files travel?

## How they find each other

Neither app has a server. There is no central list of who is online. Each
copy has to find the others on its own, and both do it the same way. They
call out to the whole network and wait for someone to answer.

Computers on a network have two common ways to send data. TCP opens a
connection between two computers, and everything sent on it arrives complete
and in order. UDP fires off a single message with no connection and no promise
that it lands. That's fine for a quick shout to the whole network, and no good
for anything that has to arrive.

So both apps use UDP only to say "I'm here", and TCP for everything after
that. LAN Messenger shouts on UDP port 50000 with its user ID. BeeBEEP shouts
on port 36475 with the word "BEE-BEEP" and the TCP port where it's listening.
A copy that hears someone new opens a TCP connection to them, and from then on
everything goes over that line.

![Two columns, LAN Messenger and BeeBEEP, four steps each. LAN Messenger: call out over UDP port 50000 to multicast 239.255.100.100 and broadcast, with an XML announce and the user ID; whoever heard it connects over TCP port 50000 and sends MSG with its user ID; the two agree on a secret key using a public key; then they trade name, status and note. BeeBEEP: call out over UDP port 36475 to multicast 224.0.64.75 and broadcast, with BEE-BEEP and the TCP port but no name; whoever heard it connects to that port, 6475; both send a BEE-CIAO hello with name, status, version and a public number, locked with a fixed key; both work out the same key from their own secret number and the other's public number.](../../assets/beebeep/find-and-connect.svg)

## Saying hello and locking the line

Once the TCP line is open, the two computers introduce themselves and agree
on a secret key. Every chat message after that is locked with it, so the
other computers on the network can't read it. The hard part is agreeing on a
key without ever sending it in the open.

LAN Messenger uses a pair of keys: a public one anyone can have, and a private
one that unlocks whatever the public one locked. The caller makes up a random
secret key, locks it with the other side's public key and sends it over.
BeeBEEP uses math instead: each side mixes its own secret number with the
other side's public number, and both land on the same key without it ever
crossing the network. From then on, both lock every message with AES, a
standard method for locking data with a secret key.

BeeBEEP's hello is the one message that can't use that key, because the hello
is what carries the public numbers. So BeeBEEP locks the hello with a key made
from a network password instead, or at least it means to.

## What one message looks like

Say I type "hi" and press Enter. Each app wraps it in a few layers before it
goes on the line.

LAN Messenger writes it as XML, a text format where each value sits between
labels in angle brackets:

```xml
<lmcmessage>
  <head>
    <from>user-a</from>
    <to>user-b</to>
    <messageid>1002</messageid>
    <type>message</type>
  </head>
  <body>
    <font>Arial,10,-1,5,50,0,0,0,0,0</font>
    <color>#202020</color>
    <message>hi</message>
  </body>
</lmcmessage>
```

The head says who it's from and who it's for, and the body has the text and
how to draw it. BeeBEEP writes the same thing as one line of short fields,
starting with the kind of message, "BEE-CHAT", and ending with the text.

Both apps then lock the message and put its length in front, written as a
number. That number is the size label: it tells the receiver how many bytes
to read before the message ends. A byte is the smallest piece of data a
computer sends, enough for one plain letter like "h".

Both also confirm delivery. The receiver answers with the message's number,
and LAN Messenger sends the message again if that answer doesn't come.
BeeBEEP also tells the sender when the message was read.

![Two columns showing how the text "hi" is wrapped. LAN Messenger: write it as XML with a head and a body, lock it with AES, put MESSAG in front, put a 4-byte size label in front, send it on the TCP line. BeeBEEP: write it as one line of seven fields separated by an invisible character, pad it with spaces to whole 16-byte blocks and lock it, put the size label in front, 4 bytes but only 2 on the hello, send it on the TCP line.](../../assets/beebeep/message-wrapping.svg)

## How files travel

Neither app sends a file through the chat line. The chat line carries the
offer and the answer, and the file travels over a second TCP connection.

In LAN Messenger, once the other person accepts, the sender calls the
receiver and streams the file across in pieces. The chat line is locked, but
the file isn't.

In BeeBEEP the receiver calls the sender. That connection starts with the
same hello and lock as the chat, and the receiver asks for the file with a
password made for that one file. The sender waits for each piece to be
confirmed before it sends the next.

![Two columns comparing file transfers. LAN Messenger: an XML file request with ID, name and size on the chat line; the other side answers accept; the sender connects to the receiver on port 50000 and starts with FILE, the file ID and its user ID; the receiver answers START and the raw bytes follow in pieces of up to 65,535 bytes, not locked. BeeBEEP: a BEE-FILE offer with name, size, ID, password, port 6476, date last changed and type; the receiver connects to the sender on that port; same hello and lock as the chat, then the receiver asks for the file by ID and password; the file comes in pieces, each one confirmed before the next.](../../assets/beebeep/file-transfer.svg)

## Only messages, never code

Writing all of that down took a long time. And honestly, my interest was low
at that point. Most of the people I needed to talk to sat near me, so
whenever the two apps got in the way, I just got up and talked to them in
person. That short-circuited the whole problem, and the project went quiet
for a month at a time.

Every step in the last few sections is a message on the network, and the
other computer never sees the code that produced it. If my program sends
exactly the same bytes, in the same order, at the right moments, the original
apps treat it as one of their own. So my app could join both networks as a
member, and I didn't need C++ to build it.

I did try. I spent some time learning C++, and I tried QML, the language Qt
uses for its interfaces. But JavaScript was already familiar to me, and it's
what the company already uses. On top of that, everything about these apps was
confusing at the start, and in JavaScript I could map out the big ideas first
without getting lost in the details.

## Learning the language before talking

I started with LAN Messenger, and I made myself one rule: no talking to the
network until I could write and read its messages perfectly on my own
computer.

So the first piece I built was a translator. It takes a message like "Leonardo
says hi" and turns it into exactly the bytes LAN Messenger expects to receive,
and it does the reverse for incoming messages. Programmers call this a codec,
short for coder/decoder. I tested it against real messages until it got every
one of them right.

I had AI tools around while I did this, but I used them for small pieces, and
I checked every line they gave me against the original apps. Later I also set
up workflows where AI agents wrote the code for a piece of work I had already
planned. I still read everything that came back and decided every next step
myself. I didn't trust them to drive: code like this has to match another
program byte for byte.

Only when the translator was right did I connect it to the real network.
Eventually I had a small desktop window where LAN Messenger contacts showed
up, and I sent a message to another computer on the network running the
original app. It arrived.

After that first message, every piece I got working made the two apps on my
screen more annoying, because now I could see how close I was to getting rid
of one of them. The closer it got to something I could use every day, the
less patience I had for the old way, and that impatience is what brought me
back to the project after each pause.

## The day it didn't work

Then I did the same for BeeBEEP. I built it, and to test it I ran two copies of
my own program. They found each other, said hello and chatted. I thought I was
done.

So I tried it with a real BeeBEEP on the office network, and got nothing.
The real app could see mine and tried to say hello, but the conversation died
on the spot.

The problem was that my two copies agreed with each other because they had
the same mistakes. Testing against myself proved nothing.

I could tell something in the hello was wrong, but I couldn't pin it down, and
tests like this were always hard for me to get right. I had heard engineers say
AI models were decent at exactly this kind of digging, so I tried it. I
recorded what the real BeeBEEP was sending and gave the model the recording
and the original source code. A few hours later it came back with the cause:
two problems, both in the hello.

The first was the size label. Every message after the hello has a 4-byte size
label. But when the hello goes out, neither side knows the other's version
yet, so BeeBEEP writes it with an older, 2-byte label. My program expected 4
bytes on everything.

The second was the lock on the hello. It's supposed to use a key made from
the network password. But one comparison in that part of the code is
backwards, so every byte of the key stays zero, whatever the password is. The
hello is locked with a key of nothing but zeros. Right above that line sits a
comment that literally says "What the hell...".

My program now copies both quirks exactly. The next time I ran it, my program
showed up in the real BeeBEEP's contact list, and its people showed up in mine.

That day changed two things. My tests now check my program against recordings
of the real apps and against their code, never just against another copy of
itself. And I had watched the model find in a few hours what I hadn't found at
all.

## Putting it together

With both working, I put them into one desktop app. It's built in four
layers, and each layer only talks to the ones next to it. At the bottom, one
translator per protocol turns messages into exact bytes and back. Above each
sits an engine that does everything from the sections above: calling out,
connecting, saying hello, locking, receipts and files. Above the engines, a
common layer makes both networks look the same, so a contact or a message is
the same thing whichever network it came from. Every contact's ID starts with
its network's name, so two people with the same name never get mixed up. At
the top is the window, built with Electron, which makes desktop apps with the
same tools as a web page. The window doesn't know what XML is, or what
"BEE-CHAT" means.

![The app's layers, top to bottom: the window, which only talks to the common layer; the common layer, where one adapter per network turns both into contacts, messages and file transfers, and contact IDs start with the network's name; side by side, the BeeBEEP engine and the LAN Messenger engine, each with its own translator inside; and at the bottom, the office network with the original apps on other computers.](../../assets/beebeep/app-layers.svg)

The window is where the original problem finally went away:

- One list. At the top are the people I've talked to, from both networks.
  Below them is everyone else who is online, grouped by network, with BeeBEEP
  first because it's the better of the two.
- One search box that finds people on both networks and also searches old
  messages.
- My app shows up in both networks at once, so nobody else has to install
  anything or change anything. If you still use the original BeeBEEP or LAN
  Messenger, you can reach me and I can reach you.
- If one of the networks has a problem, the other keeps working.

Eventually I chatted with both original apps on another computer, in both
directions, from the same window. The two icons in the corner became one.

## Past the finish line

That was the finish line I had set for myself: one window, both networks,
talking to the original apps in both directions.

Up to there, I had kept the AI on a short leash: small pieces, every line
checked, and the one BeeBEEP day when I let it dig on its own. That day stayed
with me.

So once I was past the line, I let the AI do the work while I directed it. I
still expected to spend my time fixing what it got wrong.

Instead, it had to prove every change. Each one came with a test that failed
before the change and passed after it. The tests checked my app against
recordings and the code of the real BeeBEEP and LAN Messenger, not against
itself. That was the lesson from the day BeeBEEP didn't work, and now it
applied to the AI too.

And I kept using it every day on the office network. That was the last check,
and the one I trusted most.

It was also fast. In the last stretch, more changed in a few weeks than in all
the months before. One day I had eight agents working at
the same time, each on a different part of the window, while I reviewed what
came back. I wrote more about that way of working in
[I stopped typing and started directing](/blog/i-stopped-typing/).

It took the project far past where I had planned to stop. Most of what
follows came after that decision.

## A third me

Once I used it for real, my colleagues saw a third me in their list. I had
copied LAN Messenger's ID recipe with one wrong ingredient: my display name
where it uses my Windows login, next to the network card. BeeBEEP's ID I hadn't
copied at all. BeeBEEP knows people by their name and a random code it saves
the first time it runs, and my app had made up its own. To both apps, I was
someone new.

Now my app reads both apps' settings on my computer, without changing them,
and introduces itself with the same name and ID. I'm one person again.

From this I learned the AI could make it work, but it still didn't know my
intent. So I got more critical of its work and asked it a lot of questions,
often idiotic ones. Asking those questions was a job an agent could do too, so
I started handing it to one: a GPT reviewer that reads the other AI's changes
and tries to break them.

It found real things. If I changed my name in the app, file transfers to
BeeBEEP would still introduce me by the old one: each file connection starts
with its own hello, and that hello still carried the old name. I would never
have caught that by hand.

## Bugs you only find by using it

After that I used it every day, at my desk, with the people around me. When
something looked wrong, I took a screenshot, pulled the app's log, and worked
out what had happened. Two of those stuck with me.

Text worked fine, but whenever I sent a file to someone on BeeBEEP, their app
hung up on mine in under a tenth of a second, and they disappeared from my
list. The cause was one empty field. The file offer carries the date the file
was last changed, and my app left it blank. The original BeeBEEP doesn't
complain about a message it doesn't like. It just closes the connection.
Filling in the date fixed it.

Another time my app said LAN Messenger was unavailable. The original LAN
Messenger was still installed and running on my computer, holding port
50000, which both programs need, and only one of them can have it. Now my app
waits and tries again every few seconds, and connects on its own as soon as
the original closes.

## What it is now

It's the app I use all day at work, instead of the two it replaced.

![The app with a conversation open. The list shows recent conversations from both networks at the top, and the people online below, grouped by BeeBEEP and LAN Messenger.](../../assets/beebeep/conversation-light.png)

Besides chatting, it can:

- send and receive files and whole folders, with people on either network;
- keep the history on my computer and search it;
- show formatting, code, link previews and images;
- show when a message was read and when someone is typing;
- notify me, sit in the tray, and start with Windows;
- set me as away when I leave the computer;
- send my name, a short status note and a photo to both networks, and update
  them live when I change them.

![The preferences, with the profile section: photo, display name and status note, and a note on what each network receives.](../../assets/beebeep/preferences-profile.png)

It took about four and a half months, in three bursts with a quiet month
between each. By the end there were 581 commits, about a hundred pull
requests, and around 1,600 automated tests that run before any change goes
in.

The code is on GitHub, under the same license as the two original apps:
[github.com/Lmedeiros-leiman/LanMessaging-BeeBeepLanMessenger](https://github.com/Lmedeiros-leiman/LanMessaging-BeeBeepLanMessenger)

## Looking back

I came out of this knowing far more about how computers talk to each other
than I did when I started, and I learned all of it by needing it. I know how
a computer finds others with no server, how two strangers agree on a key in
public, and why a message needs a size label, all because a chat app at work
annoyed me.

This project is also where I learned two things about AI. It can move much
faster than I can, and I can trust it, as long as it has to prove every change
and someone keeps checking. I didn't believe either of those when I started.

I also came close to never starting. "It's just how it is" felt true for a long
time, and it wasn't. Both apps were open source, and their messages could be
recorded and read.

So if something bugs you every day, look inside it. You might be able to fix
it too.
