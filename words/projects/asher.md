---
ben_pass: no
---
The drawing's own words (each part, each plate and each size, as the part panel, the parts list and Measurements
show them) are in asher-drawing.md, next to this file.

# Title
Asher

# Hook (one line under the title)
A hobby car kit, a small computer and a webcam. Claude drives him: it looks, listens, decides and sends short moves.

# Intro (the paragraphs under the hook)
Asher is a small robot car built from a hobby kit: an ACEBOTT QD001 Smart Car, about $60. The kit gives him an ESP32 board, four mecanum wheels (the kind that can drive sideways) and an ultrasonic distance sensor.

On top sit a Raspberry Pi 4 and a webcam, an eMeet C980 Pro, which is also his microphones and speaker. They ride on plates cut from a plastic litter box.

Claude, an AI model, drives him. He speaks in a British voice called Lewis.

# Photo beside the intro, for screen readers (what the photo shows, read out in place of it; placeholder words for Ben to replace)
Asher from the side: the webcam at the front, the computer case and coiled cable on top, the controller board in the middle, the power bank on its plate at the back with the motor battery's holder under it, and the yellow mecanum wheels.

# Photo beside the intro: caption (under the photo; placeholder words for Ben to replace)
Asher from the side.

# Jump links, for screen readers (the name read out for the row of links under the intro)
On this page

# Jump link: what it can do
What it can do

# Jump link: the journal
The journal

# Jump link: the receipt
The receipt

# Jump link: the core
The core

# Title block: stage
Stage

# Stage steps, for screen readers (the name read out for the three steps)
Stage of this build

# Stage steps: this build, for screen readers (read out after the step he is on)
(this build)

# Stage note (beside the stage steps, and again in the core)
He works in trial runs at home, one run at a time. Hide and seek is built but has only been tested on the laptop.

# Title block: topic
Topic

# Title block: last updated
Last updated

# Last updated (the date in the title block)
2026-11-15

# Title block: credit
Credit

# Credit (in the title block)
Built by Ben with Claude

# Title block: status
Status

# Status (in the title block)
Real, Ben’s bench

# Drawing: heading
The drawing

# Drawing: under the heading
Drag to turn him, or tap a part to see what it is. Every part drawn is on the robot today.

# Drawing status chip (on the drawing’s top corner, and in the part panel when nothing is selected)
Real and built. In progress.

# Drawing: heading, for screen readers (read out, not shown)
The model

# Drawing, for screen readers (read out for the drawing itself)
Model of Asher. The parts are buttons: Tab reaches the first, arrow keys move between them, Enter selects.

# Drawing: number key, for screen readers (the name read out for the numbered list of labels)
Key to the numbers on the drawing

# Drawing: labels button
Labels

# Drawing: explode slider
Explode

# Drawing: hint under it (the line under the drawing)
Drag the drawing to turn it, with a mouse or a finger. Sizes are in millimetres.

# Part panel: heading
Selected part

# Part panel: hint
Tap a part in the model or the list

# Part panel, nothing selected: heading
Asher as built

# Part panel, nothing selected: line
Nothing selected. Tap any part to see what it is and what it does.

# Whole robot: what it is (in the part panel when nothing is selected)
Four-wheel car with mecanum wheels: a hobby kit with two decks, plus two small plates Ben cut from a plastic litter box, raised on standoffs.

# Part panel, nothing selected: levels
Levels

# Whole robot label
Whole robot

# Whole robot: where the size came from (in the part panel)
from the as-built model; Measurements says how each size was got

# Weight label
Weight

# Weight: where it came from
Ben’s scale, both batteries in

# Part panel: size
Size

# Part panel: mass
Mass

# Part panel: price
Price

# Part panel: price note ({date} is filled in)
est., prices checked {date}

# Part panel: on the robot
On the robot now

# Plate panel: level ({n} and {total} are filled in)
Chassis. Level {n} of {total}, counted from the floor up.

# Plate panel: plate
Plate

# Plate panel: kit deck
Kit deck

# Plate panel: top
Top, above the floor

# Plate panel: made of
Made of

# Plate panel: not recorded
not recorded

# Parts beside the drawing: heading
Parts on the robot

# Parts beside the drawing: count ({n} is filled in)
{n} parts

# Parts beside the drawing: on the robot
on the robot now

# Parts beside the drawing: fixed parts
Fixed parts

# Parts beside the drawing: chassis
Chassis, from the floor up

# Part, read out ({name} and {role} are filled in)
{name}, {role}, on the robot now

# Fixed part, read out ({name} is filled in)
{name}, fixed part, on the robot now

# Plate, read out ({name} is filled in)
{name}, chassis plate

# Drawing corner: sheet name (the small title block in the drawing’s corner)
Hardware

# Drawing corner: view ({view}, {t} and {p} are filled in)
View {view} ({t}°, {p}°)

# Drawing corner: view at the start
Iso

# Drawing corner: view once turned
Turned

# Drawing corner: scale ({s} is filled in)
Scale 1 mm = {s} px

# Drawing corner, read out ({sheet}, {view} and {scale} are filled in)
Asher, {sheet} sheet. {view}. {scale}.

# Drawing arrows: front
front

# Drawing arrows: left
left

# Drawing arrows: up
up

# Estimate mark (after a figure that is a published one, not a measurement)
est.

# Unknown mark (where a figure is missing)
unknown

# Drawing: without JavaScript (shown only when a browser runs no scripts)
The drawing needs JavaScript. The parts list and every size are in the core, further down.

# Drawing: software still to come (the line under the drawing sheet)
A drawing of his software is still to come.

# How to read the drawing: heading
How to read the drawing

# How to read the drawing (the paragraphs inside it; the colour key follows)
Asher is real: every part in the drawing is on the robot, stacked the way the model shows. The model was made from photos, a tape measure and a scale; Measurements, in the core, lists every size, where it came from and how good it is.

"est." means the maker’s or a seller’s published figure for that model, not a measurement of the part on the robot. "unknown" means no figure was found. Prices are estimates, not paid.

The colours group the parts:

# Colour key: computer
computer

# Colour key: boards
boards

# Colour key: sensors
sensors

# Colour key: power
power

# Colour key: drive
drive

# Colour key: plates
plates

# Colour key: pillars
pillars

# Drawing title block: drawn from
Drawn from

# Drawn from
Photos, a yardstick, a tape measure and a scale

# Drawing title block: scale
Scale

# Scale
Millimetres

# What runs where: heading
What runs where

# What runs where: intro (the paragraph under the heading)
Claude does the thinking, in the cloud. A Raspberry Pi on the robot handles the camera, the microphones, the speaker and the word "stop". The ESP32 board from the car kit runs the wheels. A laptop in the house does the heavy listening, the voice and two quick vision checks on its graphics card.

# What runs where: at a glance (a table: one row per line, cells split by |, the first row the column names)
Job | Runs on | microSD card | Graphics card
Choosing each move, seeing what's in the frames, writing what Asher says | Claude, in the cloud, called from the laptop | No | No
Camera | The webcam, read by the Pi | Yes | No
Microphones, cutting speech into lines | The Pi | Yes | No
Writing down what was said | The laptop (Whisper small.en); a backup on the Pi (Whisper tiny.en) | Only the backup | The laptop's copy uses it; the backup doesn't
Knowing who is talking to Asher | The Pi | Yes | No
Stopping on a spoken "stop" | The Pi | Yes | No
Asher's voice | The laptop (Kokoro, "Lewis"); a backup on the Pi (Piper, "Alan") | Only the backup | The laptop's copy uses it; the backup doesn't
Speaker | The webcam's speaker, played by the Pi | Yes | No
Wheels and the distance sensor | The ESP32 | No: its firmware is on the chip | No
Refusing to drive into things (the depth reflex) | The laptop | No | Yes
Guessing which room he's in | The laptop | No | Uses it; built to fall back to the processor
The phone app for driving him remotely | The Pi serves it; Tailscale from outside the house | Yes | No
Claude Code's Asher tools, the driver, the talker | The laptop | No | No

# What runs where, On the Pi: heading (the short sections under the table, each a heading and its words)
On the Pi

# What runs where, On the Pi
The Pi runs Raspberry Pi OS (64-bit). One program, the teleop server, does almost everything on the robot:

- Camera: takes the frames Claude looks at, and streams live video to a browser.
- Microphones: cuts what it hears into separate lines by loudness and sends them off to be written down.
- Who is talking to Asher: marks the lines said to him (his name, a quick follow-up, or an answer to a question he just asked). Only those reach Claude, plus any "stop".
- Stop on the robot itself: a heard "stop" halts the wheels and refuses new moves for a few seconds, whatever the AI is doing.
- Speaker: plays Asher's voice.
- Wheels: passes each move to the ESP32 over the home Wi-Fi.
- The web page for driving him by hand.
- Wind down: a goodbye line, then a clean power-off.

When the laptop is away, the Pi has its own backups: a small speech-to-text model (Whisper tiny.en), which hears worse, and a second British voice (Piper, "Alan").

# What runs where, On the ESP32: heading
On the ESP32

# What runs where, On the ESP32
Its own firmware, stored on the chip, runs the four wheel motors and reads the ultrasonic distance sensor at the front. It takes short timed moves from the Pi. Per the firmware in the repo, it cuts any move off at 10 seconds and stops the motors by itself if no command arrives for 30 seconds.

Not sure: which saved firmware build is on the chip isn't recorded. Both saved versions (March and April) have these two limits.

# What runs where, The microSD card: heading
What needs the microSD card

# What runs where, The microSD card
Only the Pi. It starts up from a 32 GB microSD card, and everything on the Pi lives on that card: the operating system, the teleop server, the backup voice and the backup speech model. The ESP32 keeps its firmware on the chip, and the laptop has its own drive. Cards have died when the power cut out without a clean shutdown: in April, after two power cuts, and on 2026-11-03, when the Pi was left on its power bank until the bank ran flat. A card was also found dead on 2026-11-01, after six months unused; that cause wasn't recorded. So Asher is always shut down properly before the power goes off, and a script rebuilds a fresh card in about 25 minutes.

# What runs where, Vision: heading
Vision

# What runs where, Vision
The camera is the eMeet webcam on the Pi. Claude looks at the frames itself and works out what is in them; no separate object detector runs. Two quick checks run on the laptop's graphics card:

- A depth model (Depth Anything V2 Small) watches the video during each forward move. It stops the move if anything is closer than 30 cm, the floor drops away, or the video stalls.
- Place recognition (DINOv2, a pretrained image model) compares the view with saved photos to guess which room Asher is in.

# What runs where, Hearing: heading
Hearing

# What runs where, Hearing
The eMeet's two microphones are on the Pi. The Pi sends each line to the laptop, where Whisper (small.en) writes it down on the graphics card and a filter throws away the lines Whisper invents out of noise. If the laptop is away, the Pi's own small Whisper takes over.

# What runs where, Speech: heading
Speech

# What runs where, Speech
Claude writes the words. In conversation a small quick model (Haiku) answers; while driving, the driving model speaks for itself. The voice is Kokoro, an open text-to-speech model, on the laptop's graphics card, in the "Lewis" voice with feelings marked in. The sound goes to the Pi and out of the eMeet's speaker. He starts speaking about 3 seconds after the person stops. If the laptop is away, the Pi speaks in the Piper "Alan" voice. The laptop's hearing and voice reach the Pi over a secure link that the laptop opens when Ben logs in.

# What runs where, From a phone: heading
From a phone, over Tailscale

# What runs where, From a phone
The phone app is a web page the Pi serves. It opens in the phone's browser with nothing to install, and has live video, audio both ways (talk through Asher, hear the room) and a big on-screen pad for driving. At home it opens over the Wi-Fi; from anywhere else, the phone first joins Ben's private Tailscale network. A person drives in "manual" mode; while Claude has control, the page shows only the video and the readings. Ben's cousin has run him remotely this way. On an iPhone the audio ran about 3 seconds late.

Not sure: whether Tailscale is set up on the card rebuilt on 2026-11-14, and whether remote driving still works. It hasn't been tried since.

# What runs where, From the laptop: heading
From the laptop

# What runs where, From the laptop
Claude Code on the laptop gets a set of Asher tools (move, look, listen, speak, where am I, stop and shut down, among others) through a small bridge program. That's how a Claude session drives him or talks through him. Two lean programs do the same with less overhead: the driver, where Opus 5.5 takes one move per step, and the talker, where Haiku handles speech only, with no tools. The laptop also runs the hearing, the voice, the depth reflex and place recognition. At home it reaches the Pi over the home Wi-Fi.

# What runs where, graphics card: heading
How much needs a graphics card

# What runs where, graphics card (a table, as above)
Job | Uses the laptop's card today | Without one
Claude itself | No, it runs in the cloud | Same
Everything on the Pi and the ESP32 | No | Same
Hearing (Whisper small.en) | Yes | Not sure: not tried on the laptop's processor. The Pi's own small Whisper works, and hears worse
The voice (Kokoro "Lewis") | Yes | Not sure: not tried without it. The Pi's "Alan" voice works
Depth reflex | Yes | Not sure: built for the graphics card, not tried without it. Asher can drive without this reflex; the spoken stop on the Pi still works
Place recognition | Yes | Built to fall back to the processor; not timed

# What runs where: in short (the closing line)
In short: nothing Asher does strictly needs the graphics card. Without it he falls back to the Pi's own hearing and voice, and still drives under Claude and stops on "stop". The card adds better hearing, the Lewis voice, the forward reflex and quicker place guesses.

# What it can do: heading
What it can do today

# What it can do: he can column (the table’s column names)
He can

# What it can do: last seen column
Last seen working

# What it can do: how well column
How well

# Can do 1: he can (one row of the table; the rows run in number order)
Be driven from a phone or a browser, in every direction, with live video and two-way audio, from anywhere

# Can do 1: last seen working
2026-04-19

# Can do 1: note under the date (may be left out)
a remote driver, 15-20 min

# Can do 1: how well
Worked then; the audio on an iPhone ran about 3 s late. Not sure it still works: remote driving hasn't been tried since the card was rebuilt on 2026-11-14.

# Can do 2: he can
Drive himself, with Claude choosing each move from a photo and the distance sensor

# Can do 2: last seen working
2026-11-01

# Can do 2: how well
The best run was a full round trip: 13.1 min, 88 moves, no bumps. Ben: {{Ben: That was the best run yet.}}

# Can do 3: he can
Hear people and answer out loud

# Can do 3: last seen working
2026-11-15

# Can do 3: how well
Works. The laptop does the listening now, and a small quick model answers: he starts speaking about 3 s after the person stops. Ben: {{Ben: The speed of the replies were good.}}

# Can do 4: he can
Stop when someone says "stop", on the robot itself, whatever the AI is doing

# Can do 4: last seen working
2026-11-01

# Can do 4: how well
4.3 s from the word to the stop. The power switch is still the real stop.

# Can do 5: he can
Go to sleep on "wind down": say goodbye and shut down cleanly

# Can do 5: last seen working
2026-11-01

# Can do 5: how well
Off the network in 15 s.

# Can do 6: he can
Look around 360° and guess which room he is in from photos

# Can do 6: last seen working
2026-11-01

# Can do 6: how well
80% right on single photos where he had been before, poor in new spots.

# Can do 7: he can
Refuse to drive forward into something, using a depth model on the laptop’s graphics card

# Can do 7: last seen working
2026-11-01

# Can do 7: how well
One live stop at 29 cm.

# Can do 8: he can
Follow a route Ben drove for him, with NoMaD (a navigation model from robotics research)

# Can do 8: last seen working
2026-11-03

# Can do 8: how well
Partly: the best try got 33 of 52 waypoints before losing the map.

# What it can do: note under the table
"Last seen working" is the most recent live run on record.

# Then: heading
Then

# Then: title
March to April 2026: a kit, a brain, first drives

# Then (its paragraphs)
Day 1 took about four hours, against the kit’s one. Then the motors would not move. Claude tried 15 pins, an I2C scan and all 210 pin pairs. The motors sat behind a shift register chip, and Ben held the car in the air and called out which wheel moved for each of 8 bit patterns.

In April the Raspberry Pi and the webcam went on. On 04-19 Claude drove him for the first time: about 10 minutes, no collisions. On 04-21 he made his first trip to another room.

# Now: heading
Now

# Now: title
November 2026: a voice and quick ears

# Now (its paragraphs)
After about six months of pause, he woke up on 11-01 and drove by voice alone for about 40 minutes. That night Opus drove the full round trip in 13.1 minutes.

In mid-November he got a new voice (Lewis, with feelings), a quick talker that answers in about 3 s, and a fix for the false alarms that quick talking exposed: the ears gate, a stricter name match, and a "stop" that always gets through.

Hide and seek is built and tested on the laptop, not yet played. It waits on a charged motor pack.

# Next: heading
Next

# Next: title
The upgrade: a printed chassis with swappable faces

# Next (its paragraphs)
Today his body is a stack of plates, top-heavy enough that his speed is capped at 150 of 255. The plan: a whole new printed chassis with room to grow, and a camera on two servos so he can look side to side and up and down.

His face will be a screen: an old phone, a Motorola Droid from 2009-2010 that still works. The face already runs on it: eight moods, with a handlebar mustache for a mouth and a monocle over one eye. Printed props will go on with magnets, with pins so a face only goes on one way.

Ben’s cap is under $100. Rough cost: about $40-80 est.

# Next: milestones (a list, in order; which are reached, and when, is kept in the code)
- M0 plan agreed
- M1 measured
- M2 designed
- M3 fit kit printed
- M4 chassis printed and cut
- M5 rebuilt
- M6 proven
- M7 first seasonal face (Christmas)

# Milestone: reached ({when} is filled in)
Reached {when}

# Milestone: next
Next

# Journal: heading
The journal

# Journal: under the heading
Newest first. Each entry says what changed and what went wrong.

# Journal: what changed label
What changed

# Journal: what went wrong label
What went wrong

# Journal entry: date (one entry is four slots, date to what went wrong. The page shows them in this order, newest first: to add one, copy a whole entry and paste it above this one)
2026-11-15

# Journal entry: title
Hide and seek, built

# Journal entry: what changed (a list)
- Hide and seek, with Claude as the seeker, is built and tested on the laptop. Players show him a toy, hide it while he counts aloud, then follow him and call out clues. He looks all round each room and asks {{Asher: Is that it?}} when he thinks he sees it.

# Journal entry: what went wrong (a list)
- Not played yet. It waits on a charged motor pack.

# Journal entry: date
2026-11-15

# Journal entry: title
A quick talker, and the false alarms it exposed

# Journal entry: what changed (a list)
- Listening moved to the laptop: 0.14 s a clip instead of 2.5 s, and 20 of 20 test lines right, against 6 on the Pi. The Pi keeps its own small model as a backup.
- Ben’s split: a big model drives, a small fast one (Haiku) talks. In his words, the big model is {{Ben: far too reasoning intensive and slow to respond quickly enough for interacting with Asher to be fun.}} The talking half came first. It only talks and never moves him. He now starts answering about 3 s after someone stops, where it used to take 10 to 20 s.
- The fix, the ears gate: take the speech model’s first try only, and ignore an "Asher" that the model itself doubts. The name match is stricter now. A "stop" always gets through.
- How well: every test line said to him still gets through. In about 75 minutes of ordinary noise at home afterwards, no false call got through, and the one real call was answered.

# Journal entry: what went wrong (a list)
- He began answering nobody: {{Asher: I did not quite catch that.}} Two causes. When the speech model was unsure about a burst of noise, it tried again more loosely and made up a fluent line, sometimes with his name in it. And his name match counted words like "her" and "answer" as his name.
- Two review passes found 22 problems before the change went onto the robot. The oldest had been there for weeks: a "stop" shouted three times was thrown out as a stutter before the stop rule ever saw it. That is fixed.

# Journal entry: date
2026-11-14 and 15

# Journal entry: title
He finds his voice

# Journal entry: what changed (a list)
- Ben: {{Ben: Asher’s speech is very robotic... There’s no fluidity to the way the sentences flow.}} The Pi made the voice itself, and took 8 seconds to make a 13-second line. Now the laptop’s graphics card makes each line and the Pi only plays it. Ben heard four British voices and picked one called Lewis.
- Two newer voice engines were tried. One was better but too slow; the other was lively but sounded like a different man on every line.
- What worked: keeping Lewis and changing how he says a line: his pace, how high his voice sits, how much it rises and falls. Sarcasm comes out flat and slow; misgiving lower, slower and quieter; delight higher and quicker. Ben: {{Ben: Sarcasm was significantly better in this rendition.}}

# Journal entry: what went wrong (a list)
- At first he heard his own voice and thought he was being spoken to.
- A line full of numbers was too long to say in one go. It is now cut into pieces the way the voice engine itself does it.

# Journal entry: date
2026-11-12

# Journal entry: title
A mustache and a monocle

# Journal entry: what changed (a list)
- Ben asked: {{Ben: can we change the mouth to be an expressive handlebar mustache and have a monocle over the left eye?}} The mustache is the mouth now and carries the mood: the tips curl up when he is pleased and droop when he is sad. When he is startled the monocle drops out and swings on its chain.

# Journal entry: what went wrong (a list)
- The first mustache curled straight up into his eyes, and the sad one ran off the bottom of the screen.

# Journal entry: date
2026-11-12

# Journal entry: title
This drawing made true to the robot

# Journal entry: what changed (a list)
- The drawing now matches the photo-measured model part for part: 122 pieces. Every size says how it was got: tape and scale, a photo against a yardstick, a plain photo, a maker’s datasheet, or a best guess.

# Journal entry: what went wrong (a list)
- A separate review caught nine problems, among them a deck drawn over the computer when the wheels were swapped, and a claim that every size was good to 5 mm when some are guesses. All fixed before it went up.

# Journal entry: date
2026-11-12

# Journal entry: title
An old phone becomes his face

# Journal entry: what changed (a list)
- The phone is a Motorola Droid from 2009-2010, last used in 2012. Its battery is dead, so one USB cable carries both its power and its face.
- The face is a page in the phone’s own browser, drawn on a canvas: eight moods, eyes that look around and blink, and a squish when you poke the glass. Asher’s own software can drive it.

# Journal entry: what went wrong (a list)
- The phone rejected the right Wi-Fi password every time, a known bug in phones of that age. About an hour went on the Wi-Fi before the phone’s own log showed the password was never the problem.

# Journal entry: date
2026-11-11

# Journal entry: title
Measured, and the plan agreed

# Journal entry: what changed (a list)
- Three photos with a yardstick gave the real wheelbase (141 mm, not 155) and the lens height (about 95 mm). Then Ben’s scale and tape: 1325 g with both batteries in, 5.5 in from axle to axle, 7 in across the wheels.
- Ben decided: a whole new chassis with room to grow, a camera on servos, the face as character, under $100, printed rather than ordered.
- Drawing the magnet idea showed a mistake: magnets alternating corner to corner would still pull an upside-down face on. With the top pair one pole and the bottom pair the other, an upside-down face is pushed away.

# Journal entry: what went wrong (a list)
- An earlier read of a side photo put the pillars at 32 mm. The yardstick was hiding their lower part.

# Journal entry: date
2026-11-11

# Journal entry: title
The before, photographed and modelled

# Journal entry: what changed (a list)
- 17 photos from every side, and a model built from them in Blender, written as a script so each size is one number with its source.
- The photos showed what nobody had written down: the computer and the power bank sit on hook-and-loop strips, the sensor is foam-taped to the top of the webcam, and loose leads hang near the wheels.

# Journal entry: what went wrong (a list)
- The first read of the power bank was wrong: the rear photo shows the slim one on record.

# Journal entry: date
2026-11-11

# Journal entry: title
The idea, and the plan

# Journal entry: what changed (a list)
- A printed chassis with faces that swap. Solid plastic in front of the distance sensor blocks it, so every face leaves its two round transducers open, and those become the face’s eyes.
- Magnets hold; two pins of different sizes take a sideways knock. The camera stays where it is, because the route maps and turn timings were all made from it.
- No print service gives a price without an upload, so the first estimate was about $100-300. The design tool, Blender 5.2, was already on the laptop.

# Journal entry: what went wrong (a list)
- Nothing yet. The kit plates’ hole pattern is not published anywhere, so Ben measures it.

# Journal entry: date
2026-11-08

# Journal entry: title
Hearing his name

# Journal entry: what changed (a list)
- Only speech said to him (his name, a quick follow-up, or an answer to his question) reaches the AI, plus "stop". Hearing moved to a bigger model on the laptop’s graphics card.
- On 20 recorded lines: 10 of 10 said to him were flagged, 0 of 10 others, about 0.5 s each.

# Journal entry: what went wrong (a list)
- On the Pi’s small speech model his name was heard as other words, so only 3 of 100 lines got flagged as said to him.
- The test lines were spoken by computer voices, so a real room will be worse.

# Journal entry: date
2026-11-03

# Journal entry: title
A research navigation model

# Journal entry: what changed (a list)
- Ben drove a route by hand so NoMaD, a research navigation model, could learn it. The model could tell where it was on the route.

# Journal entry: what went wrong (a list)
- On the Pi each step took 2.4 s at best (6-7 s live), about 10 times too slow. In four live runs he got lost each time: best 33 of 52 waypoints, nothing hit.
- Claude re-tuned the driver after every run, chasing the last failure. Next time the driver is frozen first.
- Then the motor battery died, after about 1.5-2 hours.

# Journal entry: date
2026-11-01

# Journal entry: title
Waking him up

# Journal entry: what changed (a list)
- A script rebuilt everything in about 25 minutes, and he answered when Ben called his name.
- First voice-only drive, about 40 minutes, no typing: into another room and home again. He mistook a second spot for home because a toy he used as a landmark had moved: {{Asher: Ah. I trusted a toy, and toys move. Lesson learned.}}
- Model trials on the same route: Opus did the full round trip in 13.1 minutes, 88 moves, about $2.67 at API prices.
- Each look-think-move took about 11 s, mostly model time. So Claude built a lean driver that sends about 5.7k tokens a move instead of about 248k.

# Journal entry: what went wrong (a list)
- The memory card had died again.
- Haiku could not do the trip in three tries. Sonnet got there but could not get home: it went in circles, and Ben carried it back.

# Journal entry: date
2026-04

# Journal entry: title
A brain, eyes and ears, first drives

# Journal entry: what changed (a list)
- 04-01: the first voice-controlled move. Ben spoke, the laptop wrote it down, Claude decided, and the car moved: two feet became a 2 s move.
- 04-17 to 04-19: the Pi and the webcam went on. Driving from any device, live video, audio both ways.
- 04-19: Claude drove for the first time, about 10 minutes, no collisions. The same day a remote driver drove him for 15-20 minutes, and his first voice was picked out of five.
- 04-21: his first trip to another room. On 04-25 he surveyed it properly, after Claude had called it reached three times too early: its idea of a 90° turn was really 45°.

# Journal entry: what went wrong (a list)
- On USB power alone the board rebooted under the motors. A pack of two 18650 batteries fixed it.
- 04-24: the Pi’s memory card died after two power cuts without a clean shutdown.
- Claude got stuck in debugging loops twice. Out of that came a rule to act after three failed tries, and Ben’s keep-it-simple rule.

# Journal entry: date
2026-03

# Journal entry: title
Day 1: the build

# Journal entry: what changed (a list)
- Built over an afternoon and evening: about four hours, against the kit’s one.
- The car became its own Wi-Fi hotspot with a touch-control page, and Ben drove it around from his phone.
- Claude got its own tools to drive the car: move, distance, camera, stop. Its first distance reading: 42 cm.

# Journal entry: what went wrong (a list)
- One wheel motor went on backwards. The batteries Ben bought did not fit the holder.
- The motors would not move: 15 pins, an I2C scan and 210 pin pairs found nothing. They sat behind a shift register chip.
- The one-letter bug: the car would not join the home Wi-Fi because the firmware had one letter of the network name in the wrong case. Then an old saved name kept coming back until the chip was wiped.

# Receipt: heading
The receipt

# Receipt: under the heading
What it cost, what it took, what broke, who checked it, and what isn’t known yet.

# Receipt: cost label
Cost

# Receipt: cost (its paragraphs)
The kit: about $60.

The robot as it stands: see the parts list in the core, with its total (prices est.).

The best drive: about $2.67 at API prices, for the full round trip.

The upgrade: about $40-80 est. for magnets, two servos and screws. Ben’s cap is under $100.

# Receipt: time label
Time

# Receipt: time (its paragraphs)
Day 1: about four hours, against the kit’s one.

A rebuild after the memory card died: about 25 minutes.

A pause of about six months, May to October.

# Receipt: who did what label
Who did what

# Receipt: who did what (its paragraphs)
Claude wrote the firmware, drives him (Opus) and talks for him (Haiku). It also built the model this drawing comes from.

Ben built him, decides what gets built, and measures the robot.

# Receipt: what broke label
What broke

# Receipt: what broke (its paragraphs)
The memory card, three times: in April after two power cuts without a clean shutdown; found dead on 2026-11-01 after six months unused, cause not recorded; and on 2026-11-03, when the Pi was left on its power bank until the bank ran flat.

Haiku could not drive the round trip, and Sonnet could not get home.

NoMaD on the Pi: about 10 times too slow, lost in every live run.

The motor battery, after about 1.5-2 hours.

False alarms: he answered nobody until the ears gate went in.

About an hour lost on the old phone’s Wi-Fi.

# Receipt: who checked it label
Who checked it

# Receipt: who checked it (its paragraphs)
Separate review passes: nine problems in this drawing, all fixed before it went up, and 22 in the hearing change, found before it went onto the robot.

Nobody outside has tested it yet.

# Receipt: gaps label
Gaps

# Receipt: gaps (its paragraphs)
Which firmware is on the board. It gets read at the next power-on.

Hide and seek has only been tested on the laptop.

Hearing was scored on computer voices. A real room will be worse.

Creeping up close is built and tested, but waits on a safety-rule change.

Which run counts as the first trip to another room: 04-21 reached it, 04-25 surveyed it.

# Core: heading
The core

# Core: under the heading
What he runs on, what he is made of, and how it connects.

# Before you copy this: heading
Before you copy this

# Before you copy this: first line
You build this at your own risk. It is one builder’s design, shared as it is. Nobody has certified it.

# Before you copy this: checks (a list)
- The power switch is the real stop. A spoken "stop" takes about 4.3 s.
- Tidy the loose leads near the wheels before a drive: the webcam’s spare cable and the battery lead.
- Shut him down cleanly with "wind down". The memory card has died three times, twice when the power cut out without a clean shutdown (in April, and on 2026-11-03 when the power bank ran flat).
- He has a camera and microphones. In a home, keep what he sees and hears private.

# Licence: heading
Licence and credit

# Licence: once chosen (shown only once a licence is chosen)
The builder keeps ownership of this design. You may copy it and adapt it, with credit.

# Licence: note
No licence is chosen yet; Ben picks one.

# Energy: heading
Energy

# Energy (its paragraphs)
Two batteries: a pack of two 18650 cells, and a power bank. Tap a battery in the drawing to see what it runs.

On USB power alone the board rebooted under the motors. The cell pack fixed it.

The motor pack lasted about 1.5-2 hours on 2026-11-03.

# Materials: heading
Materials

# Materials (its paragraphs)
The kit: two plates, brass pillars, four mecanum wheels.

Two plates cut from a plastic litter box.

Hook-and-loop strips under the computer and the power bank. Foam tape and the kit’s cat-face bracket hold the distance sensor on the webcam. A zip tie on the webcam.

# Parts: heading
Parts

# Parts: under the heading
Every part on the robot now, with prices (est.) and the total.

# Parts list: heading
Parts list

# Parts list: under the heading ({date} is filled in)
Prices est., where known

# Parts list: part column
Part

# Parts list: price column
Price

# Parts list: role, for screen readers (read out before each part’s role)
Role

# Role: fixed part (for a part with no role of its own)
Fixed part

# Price: not known
price not known

# Price: part of another part ({host} is filled in with that part’s role)
part of the {host}

# Price: home-made
home-made, no price

# Price: in the kit
in the kit

# Parts list: total row
Asher, as it stands

# Parts list: note ({date} is filled in)
Prices are estimates, not paid. Only the kit's price is on record so far. Parts in the kit, built into another part or home-made count as $0.

# Parts list: one part without a price ({n} is filled in)
{n} part has no known price and counts as $0.

# Parts list: parts without a price ({n} is filled in)
{n} parts have no known price and count as $0.

# Measurements: heading
Measurements

# Measurements: under the heading
The robot as built

# Measurements: note
Asher as he stands on 2026-11-11, modelled from 20 photos (three with a yardstick), Ben's tape and Ben's scale. Every size below says where it came from. Sizes read against the yardstick are good to about 5 mm, sizes read from a plain photo to roughly a tenth either way, and a few are best guesses.

# Measurements: whole robot, which way
front to back, across, up

# Measurements: axle to axle
Axle to axle

# Measurements: axle to axle, where it came from ({track} is filled in)
Ben’s tape; wheel centres {track} apart across

# Measurements: levels heading
The levels, from the floor up

# Measurements: level column
Level

# Measurements: size column
Size and height

# Measurements: plate top ({top} is filled in)
top {top} above the floor

# Every size: heading
Every size in the model

# Every size: count ({n} and {counts} are filled in)
{n} sizes: {counts}.

# Every size: size column
Size

# Every size: value column
Value

# Every size: group 1 (the headings of the groups of sizes)
Whole robot, decks, wheels and motors

# Every size: group 2
Controller and motor battery

# Every size: group 3
Computer and Ben’s plates

# Every size: group 4
Webcam and distance sensor

# Every size: group 5
Power bank

# Every size: other sizes
Other sizes

# Size count: measured (how a size was got, as counted under Every size)
measured by Ben with tape or scale

# Size count: ruler photo
read from a photo with a yardstick

# Size count: photo
read from a photo

# Size count: datasheet
from a maker’s datasheet

# Size count: record
from Ben’s build notes

# Size count: guess
best guesses

# Size tag: measured (the same, as the small tag beside each size)
Measured by Ben (tape or scale)

# Size tag: ruler photo
Read from a photo with a yardstick

# Size tag: photo
Read from a photo

# Size tag: datasheet
Maker's datasheet

# Size tag: record
Ben's build notes

# Size tag: guess
Best guess

# Wiring: heading
How it is wired

# Wiring: box label (on the outline round the parts on the robot)
On the robot

# Wiring: key
The outline marks what sits on the robot. Each arrow says what it carries.

# Wiring box: Claude (the boxes in the diagram and its table)
Claude, the AI

# Wiring box: the laptop
The laptop

# Wiring box: the Raspberry Pi
Raspberry Pi 4

# Wiring box: the webcam
Webcam: eye, ears, voice

# Wiring box: the ESP32 board
ESP32 board

# Wiring box: the distance sensor
Distance sensor

# Wiring box: the motors
Four motors and wheels

# Wiring arrow: Claude to the laptop (what each arrow carries)
tools: move, look, stop

# Wiring arrow: the laptop to the Raspberry Pi
moves and voice lines

# Wiring arrow: the Raspberry Pi to the webcam
pictures and sound

# Wiring arrow: the Raspberry Pi to the ESP32 board
moves

# Wiring arrow: the ESP32 board to the distance sensor
distance

# Wiring arrow: the ESP32 board to the motors
power

# Wiring table: from
From

# Wiring table: to
To

# Wiring table: what it carries
What it carries

# Footnote (the last line of the page)
The drawings show the model only: no camera frames, no recordings.
