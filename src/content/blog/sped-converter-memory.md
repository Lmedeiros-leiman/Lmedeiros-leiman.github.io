---
title: 'From a gigabyte to 80 megabytes'
description: 'The converter we use at work loaded entire spreadsheets into memory. This is how I made it read and write them one row at a time instead.'
pubDate: 'Nov 03 2026'
---

At work we have a small web app that converts SPED files. SPED is the system
Brazilian companies use to send their tax and accounting records to the
government, and those records are plain text files where every line is one
record, with fields separated by a `|`.

Nobody enjoys editing those by hand, so the app turns a SPED file into an
Excel spreadsheet, with one sheet for each type of record. People fix what
they need in Excel, and the app turns the spreadsheet back into a text file
the government accepts.

It worked. It also used a lot of memory. Converting one of our bigger files
pushed the app past a gigabyte of RAM. I wanted to bring that down.

## Where the memory went

The app used a library called NPOI to read and write the spreadsheets. NPOI
is good at what it does, but the way it works is that it loads the entire
workbook into memory first: every sheet, every row, every cell, each one as
its own object. Only then can you start asking it questions.

For a converter, that's a lot of work for nothing. The text file is read top
to bottom, once. The spreadsheet could be read top to bottom, once, too.
There was never any reason to hold all of it at the same time.

## Looking inside the file

A `.xlsx` file looks like one file, but it's actually a zip folder full of
XML files: one for each sheet, one for the list of sheets, one for the
styles, and a few more. You can rename one to `.zip` and open it to see for
yourself.

That meant I could skip the library entirely. .NET can already open zip
files and read XML one piece at a time, without loading the whole thing.

There was one problem. Our spreadsheets have a hidden sheet that holds the
order of the lines in the text file. Each of its cells is a formula pointing
at a cell on another sheet, something like `='0000'!B2`. To get the value, NPOI
calculated every formula, and calculating formulas is exactly the kind of
thing that needs the whole workbook in memory.

## The value was already there

Then I found out something about Excel I didn't know. When Excel saves a
file, it writes the result of every formula right next to the formula
itself. It does this so the file opens fast next time.

So the answers were already in the file. I didn't need to calculate
anything. I could read that one hidden sheet from top to bottom, take the
saved results, and write each line of the text file as soon as I had it.
None of the other sheets even needs to be opened.

The catch is that only Excel writes those results. A spreadsheet that came
straight out of our app and was never opened in Excel has formulas with no
saved values. In that case the app now stops and tells the person to open
the file in Excel, save it, and send it again. Since the whole point of the
spreadsheet is to be edited in Excel, that's a small thing to ask.

## The other direction

Writing the spreadsheet had the opposite problem. The text file mixes
record types line by line, so the rows of every sheet show up interleaved,
but inside the zip each sheet has to be written as one piece.

My answer was to give every sheet its own temporary file on disk. As each
line of the text is read, its row goes to the end of its sheet's file. When
the text is done, the app builds the zip by copying those files in, one
after the other, and the temporary files delete themselves when they're
closed. The finished spreadsheet goes to a temporary file too, instead of
sitting in memory until the download is over.

## Proving nothing changed

This app produces files that go to the government, so "it looks right" was
not good enough. The new version had to produce exactly what the old one
did.

For the text files, I converted the same spreadsheets with the old and the
new code and compared the results byte by byte. They were identical. For
the spreadsheets, I compared the old and new files cell by cell, about 3.1
million cells across our test files: sheet names and order, which sheets are
hidden, and every cell's type, value, formula and format. They matched too.
I also checked the new files with Microsoft's own validator for the format,
and it found no errors.

I also had AI tools review the code a few times, looking for the cases I
hadn't thought of: a cell typed as a number where text was expected, a file
that isn't a spreadsheet at all, someone closing the browser in the middle
of a conversion. Each of those now gets a clear error message instead of a
crash, and a cancelled conversion stops right away and cleans up after
itself.

## The numbers

Here is the peak memory used by the biggest test file, before and after:

| Conversion | Before | After |
| --- | --- | --- |
| Spreadsheet to text | 1,087 MB | 81 MB |
| Text to spreadsheet | 687 MB | 78 MB |

The spreadsheet to text conversion also went from about 23 seconds to 1.5,
because it no longer builds and calculates a whole workbook just to read one
sheet.

And since NPOI was the only thing pulling in packages with known security
problems, removing it fixed those too.

## Looking back

The fix wasn't clever code. It was finding out what was already inside the
file. Excel had been saving the answers the whole time, and the app was
throwing them away and working them out again.

Most of the work went into proving the new version gives the same results as
the old one, and that was the right place to spend it. Shrinking the memory
was the easy part. Making sure nobody would notice the change was the hard
part.
