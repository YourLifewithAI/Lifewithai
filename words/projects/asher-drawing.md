---
ben_pass: no
---
The drawing's own words for Asher's page: each part (Part, camera: name and so on), each plate (Level 1: name)
and each size (Size wheel_d: name). The part panel, the parts lists and Measurements show them. The page's other
words are in asher.md, next to this file.

# Part, main computer: role (its heading in the lists of parts)
Main computer

# Part, main computer: label on the drawing (the name beside it on the drawing)
Main computer

# Part, main computer: name (in the part panel and the parts lists)
Raspberry Pi 4 Model B, 2 GB

# Part, main computer: made by (the part panel’s second line, with the model; may be left empty)
Raspberry Pi

# Part, main computer: model (may be left empty)
Pi 4 Model B 2 GB

# Part, main computer: what it does
This is the main addition that allows Asher to navigate the house. The ESP32's are like the spine and lower nervous system that handle movements and reflexes. The Raspberry Pi is more like the higher reasoning via Claude. The Pi reads the camera, plays Asher's voice, sends what it hears to the laptop, and keeps a small speech model as a backup in case Kokoro fails. Might wipe the smaller model to free up space, though.

# Part, main computer: note (may be left empty)


# Part, main computer: price (shown in place of a worked-out price)
~ $100. Pretty sure it was $50 when I bought it in April. Holy crap chips have gotten more expensive.

# Part, camera: role
Camera

# Part, camera: label on the drawing
Camera

# Part, camera: name
eMeet C980 Pro webcam

# Part, camera: made by (may be left empty)
eMeet

# Part, camera: model (may be left empty)
C980 Pro

# Part, camera: what it does
Asher’s only eye: a wide USB webcam. Also holds the speakers and microphone. A bifocal camera would be better, as it would give Asher/Claude depth perception. Right now we're relying on the ultrasonic sensor for depth, and that sensor isn't very good.

# Part, camera: note (may be left empty)
Lies crosswise at the very front on its own clip, which hooks over the upper deck's front edge. To be honest, it's not very well secured, but so far it hasn't fallen off. The lens is about 95 mm off the floor. It is wider than the decks. Its microphones and speaker are Asher's ears and voice, and the distance sensor rides on its top.

# Part, distance sensor: role
Distance sensor

# Part, distance sensor: label on the drawing
Distance sensor

# Part, distance sensor: name
HC-SR04 ultrasonic distance sensor

# Part, distance sensor: made by (may be left empty)
generic (in the kit)

# Part, distance sensor: model (may be left empty)
HC-SR04

# Part, distance sensor: what it does
Measures how far the nearest thing ahead is, by timing an echo.

# Part, distance sensor: note (may be left empty)
Came in the kit. Foam-taped to the top of the webcam in the kit’s cat-face bracket, its two transducers about 136 mm off the floor. It's not very reliable. It tends to only hear echoes around half of the time. I'd love to update to a Lidar sensor of some kind.

# Part, controller board: role
Controller board

# Part, controller board: label on the drawing
Controller board

# Part, controller board: name
ACEBOTT ESP32 Max controller board

# Part, controller board: made by (may be left empty)
ACEBOTT

# Part, controller board: model (may be left empty)
ESP32 Max V1.0 (QA007)

# Part, controller board: what it does
The small board that runs the four wheel motors and reads the distance sensor. It takes short timed moves from the main computer over Wi-Fi. The Wi-Fi part is important because it allows Claude to run Asher remotely from my laptop over our home network. This is powered by the same batteries that run the mecanum wheel motors.

# Part, controller board: note (may be left empty)
Came in the kit. Makes its own 5 V and 3.3 V from the motor battery.

# Part, motor driver: role
Motor driver

# Part, motor driver: label on the drawing
Motor driver

# Part, motor driver: name
ACEBOTT car shield

# Part, motor driver: made by (may be left empty)
ACEBOTT

# Part, motor driver: model (may be left empty)
QA052 ESP32 Car Shield V1.0

# Part, motor driver: what it does
Sits on the controller board and switches battery power to the four motors.

# Part, motor driver: note (may be left empty)
Came in the kit. One speed line is shared by all four motors, so they cannot run at different speeds.

# Part, motors and wheels: role
Motors and wheels

# Part, motors and wheels: label on the drawing
Mecanum wheel and motor

# Part, motors and wheels: name
Four TT motors with 60 mm mecanum wheels

# Part, motors and wheels: made by (may be left empty)
ACEBOTT (kit)

# Part, motors and wheels: model (may be left empty)
TT geared motor 1:48, 60 mm mecanum wheel

# Part, motors and wheels: what it does
Four small geared motors and four wheels with angled rollers, so the car can also slide sideways. I plan on swapping these out at some point, because they're loud, and they're not very secure. They cause Asher to drift to the right, but Claude's already figured this out and makes corrections accordingly.

# Part, motors and wheels: note (may be left empty)
Came in the kit. The size is one wheel.

# Part, motor battery: role
Motor battery

# Part, motor battery: label on the drawing
Motor battery

# Part, motor battery: name
Two 18650 lithium-ion cells

# Part, motor battery: made by (may be left empty)
Nuon

# Part, motor battery: model (may be left empty)
18650, button top, protected, in the kit's two-cell holder

# Part, motor battery: what it does
The motor battery: runs the motors, the shield, the controller board and the distance sensor. I'll probably swap these out at some point. The coils that connect to the anodes get loose and can cause the whole thing to stop moving.

# Part, motor battery: note (may be left empty)
Their capacity is not in Ben’s files. On 2026-11-03 the motor battery lasted about 1.5-2 hours.

# Part, computer battery: role
Computer battery

# Part, computer battery: label on the drawing
Computer battery

# Part, computer battery: name
Anker PowerCore Slim 10000 PD power bank

# Part, computer battery: made by (may be left empty)
Anker

# Part, computer battery: model (may be left empty)
A1231

# Part, computer battery: what it does
This is a backup phone battery. It powers the Raspberry Pi and the webcam.

# Part, computer battery: note (may be left empty)
What the robot uses is its USB-C socket: 5 V, listed as its own part.

# Part, power bank socket: role
5 V supply for the computer

# Part, power bank socket: name
The power bank's own 5 V socket

# Part, power bank socket: made by (may be left empty)
Anker

# Part, power bank socket: model (may be left empty)
USB-C output of the A1231

# Part, power bank socket: what it does
Turns the power bank's cell voltage into the 5 V the computer runs on.

# Part, power bank socket: note (may be left empty)
Part of the power bank: it only works with that battery.

# Part, ears and voice: role
Ears and voice

# Part, ears and voice: name
Microphones and speaker in the webcam

# Part, ears and voice: made by (may be left empty)
eMeet

# Part, ears and voice: model (may be left empty)
C980 Pro

# Part, ears and voice: what it does
Asher's ears and voice. They are inside the webcam.

# Part, ears and voice: note (may be left empty)
Part of the webcam, no separate price or power. Two microphones and a speaker.

# Part, kit decks: name
Two kit decks

# Part, kit decks: made by (may be left empty)
ACEBOTT

# Part, kit decks: model (may be left empty)
QD001 kit, bottom and top plate

# Part, kit decks: what it does
The lower deck carries the motors; the upper deck carries the controller, shield and motor battery.

# Part, kit decks: note (may be left empty)
The whole kit cost about $60: plates, motors, wheels, controller, shield, distance sensor and battery holder.

# Part, kit decks: price (shown in place of a worked-out price)
about $60

# Part, Ben’s plates: name
Two plates cut from a plastic litter box

# Part, Ben’s plates: made by (may be left empty)
home-made

# Part, Ben’s plates: model (may be left empty)
about 3 mm plastic, two

# Part, Ben’s plates: what it does
Ben's two extra plates: one on short standoffs over the front carries the main computer; one on tall standoffs over the rear carries the power bank.

# Part, Ben’s plates: note (may be left empty)
Two sizes: 92 x 94 mm under the computer and 84 x 102 mm under the power bank, both about 3 mm thick.

# Part, pillars: name
Pillars, standoffs and screws

# Part, pillars: made by (may be left empty)
ACEBOTT kit and loose parts

# Part, pillars: model (may be left empty)
eight 40 mm and five 14 mm M3 brass pillars, M2.5 standoffs

# Part, pillars: what it does
Hold the decks apart.

# Part, pillars: note (may be left empty)


# Part, pillars: price (shown in place of a worked-out price)
brass pillars in the kit; standoffs, price not known

# Part, cat-face bracket: label on the drawing
Cat-face bracket

# Part, cat-face bracket: name
Cat-face bracket

# Part, cat-face bracket: made by (may be left empty)
ACEBOTT (kit)

# Part, cat-face bracket: model (may be left empty)


# Part, cat-face bracket: what it does
This bracket came with the ACEBOTT kit. Honestly? I kind of like it. I've considered 3D printing other brackets like the outline of an old dude with a handlebar mustache and a top hat. Might replace it entirely with a salvaged Android phone to roll with a digital face. We already tested that, the problem right now is figuring out how to mount the old phone and keep it powered. The bracket holds the distance sensor and is foam-taped to the top of the webcam. Yes. Foam-tape with velcro strips. DIY baby!

# Part, cat-face bracket: note (may be left empty)


# Part, computer case: name
Computer case with fan

# Part, computer case: made by (may be left empty)
not named in Ben's files

# Part, computer case: model (may be left empty)
Pi 4 case with fan

# Part, computer case: what it does
Protects and cools the main computer.

# Part, computer case: note (may be left empty)
About 72 x 85 x 33 mm. Its weight and fan draw are not in Ben’s files.

# Part, memory card: name
32 GB memory card

# Part, memory card: made by (may be left empty)
generic

# Part, memory card: model (may be left empty)
microSD 32 GB

# Part, memory card: what it does
Holds the main computer's software.

# Part, memory card: note (may be left empty)


# Part, battery holder: name
Two-cell battery holder and power switch

# Part, battery holder: made by (may be left empty)
ACEBOTT (kit)

# Part, battery holder: model (may be left empty)
kit holder with in-line switch

# Part, battery holder: what it does
Holds the two motor cells crosswise on the upper deck, under the power bank plate, and switches the motor side on and off.

# Part, battery holder: note (may be left empty)


# Part, board regulators: name
Regulators on the controller board

# Part, board regulators: made by (may be left empty)
ACEBOTT

# Part, board regulators: model (may be left empty)
chips not named in the files

# Part, board regulators: what it does
Make the 5 V and 3.3 V that the controller and the distance sensor use.

# Part, board regulators: note (may be left empty)
Part of the controller board.

# Level 1: name (the plates, from the floor up)
Lower kit deck

# Level 1: what it holds
The four motors sit on it, between the two kit decks, with the wheels outboard.

# Level 1: size, how it was got
read from photos, the length against a yardstick

# Level 1: height, how it was got
a best guess (the yardstick hid it)

# Level 1: made of
the kit’s own plate

# Level 2: name
Upper kit deck

# Level 2: what it holds
The controller board on brass standoffs with the motor driver plugged on top, and the two motor cells in their open holder. The webcam's clip hooks over its front edge.

# Level 2: size, how it was got
read from photos, the length against a yardstick

# Level 2: height, how it was got
read from a photo with a yardstick

# Level 2: made of
the kit’s own plate

# Level 3: name
Computer plate, cut by Ben

# Level 3: what it holds
The main computer in its fan case, on two hook-and-loop strips. It stands on four short standoffs over the front of the upper deck and overhangs it a little.

# Level 3: size, how it was got
read from photos, the length against a yardstick

# Level 3: height, how it was got
the upper deck plus standoffs read from a photo

# Level 3: made of
plastic cut from a litter box

# Level 4: name
Power bank plate, cut by Ben

# Level 4: what it holds
The power bank, lying across on two hook-and-loop strips. It stands on four tall stacked standoffs over the rear of the upper deck, above the motor cells.

# Level 4: size, how it was got
read from photos

# Level 4: height, how it was got
the upper deck plus standoffs read from a photo

# Level 4: made of
plastic cut from a litter box

# Size wheel_d: name (every size in the model, under Measurements; the value and unit come from the model)
Wheel diameter

# Size wheel_d: note
Mecanum wheel diameter, from Ben's build notes; the rear photo agrees (56 to 60 mm).

# Size wheel_w: name
Wheel width

# Size wheel_w: note
Wheel width, from Ben's build notes (listings give 28 to 31 mm).

# Size weight_g: name
Weight, both batteries in

# Size weight_g: note
The whole robot with both batteries in, on Ben's scale, 2026-11-11.

# Size wheelbase: name
Axle to axle

# Size wheelbase: note
Front wheel centre to rear wheel centre, from Ben’s tape: 5.5 in (139.7 mm). The yardstick photos gave 141 mm.

# Size track: name
Wheel centre to wheel centre, across

# Size track: note
Left wheel centre to right wheel centre. Ben's tape read 7 in (178 mm) from outer rim to outer rim; take away one 30 mm wheel width and it is 148. The top photo read about 170 across the rims.

# Size deck_l: name
Kit deck length

# Size deck_l: note
Length of the upper kit deck; the side photo reads 210 to 221. The kit's maker publishes no plate drawing (the 226 x 170 x 51 mm it lists is the box).

# Size deck_x: name
Deck centre ahead of the axle midpoint

# Size deck_x: note
How far the decks' centre sits ahead of the point midway between the axles; the side and top photos agree within 3 mm.

# Size deck_w: name
Kit deck width

# Size deck_w: note
Width of the kit decks, from the rear and underside photos.

# Size deck_t: name
Kit deck thickness

# Size deck_t: note
Thickness of the acrylic kit decks.

# Size lower_deck_top: name
Lower deck top above the floor

# Size lower_deck_top: note
Top of the lower kit deck above the floor. The yardstick hides it, so it is set where the motors sit on it centred on the axles.

# Size deck_gap: name
Gap between the kit decks

# Size deck_gap: note
Height of the pillars between the two kit decks, from Ben's build notes. The yardstick hides the lower deck; 40 mm fits the motors.

# Size pillar_x: name
Pillar positions, front to back

# Size pillar_x: note
Where the pillars stand, front to back, from the point midway between the axles (minus is behind it), as seen in the side photo. They stand in pairs about 42 mm either side of the middle (a guess).

# Size motor_l: name
Motor length (gearbox and can)

# Size motor_l: note
TT gear motor length, gearbox plus motor.

# Size motor_w: name
Motor width

# Size motor_w: note
TT gear motor width, along the axle.

# Size motor_h: name
Motor height

# Size motor_h: note
TT gear motor height.

# Size motor_shaft_in: name
Axle from the gearbox's outer end

# Size motor_shaft_in: note
How far the axle sits in from the gearbox's outer end.

# Size esp_long: name
Controller board, across

# Size esp_long: note
ESP32 Max controller board, across the robot.

# Size esp_short: name
Controller board, front to back

# Size esp_short: note
ESP32 Max controller board, front to back.

# Size esp_front_x: name
Controller board front edge

# Size esp_front_x: note
How far the controller board's front edge sits ahead of the point midway between the axles. The top photo shows the board from 20 mm behind that point to 35 mm ahead, meeting the computer plate.

# Size esp_standoff: name
Controller board standoffs

# Size esp_standoff: note
Height of the brass standoffs under the controller board.

# Size shield_gap: name
Header stack, board to driver

# Size shield_gap: note
Height of the header pins between the controller board and the motor driver plugged on top of it.

# Size plate_t: name
Ben's plate thickness

# Size plate_t: note
Thickness of Ben's plates, cut from a plastic litter box.

# Size velcro_t: name
Hook-and-loop pair thickness

# Size velcro_t: note
Thickness of a pair of hook-and-loop strips.

# Size pi_plate_fb: name
Computer plate, front to back

# Size pi_plate_fb: note
Computer plate, front to back; in the top photo its back edge meets the motor driver.

# Size pi_plate_ac: name
Computer plate, across

# Size pi_plate_ac: note
Computer plate, across.

# Size pi_plate_over: name
Computer plate overhang past the deck

# Size pi_plate_over: note
How far the computer plate overhangs the front of the upper deck.

# Size pi_standoff: name
Computer plate standoffs

# Size pi_standoff: note
Height of the black standoffs under the computer plate.

# Size pi_case_ac: name
Computer case, across

# Size pi_case_ac: note
Raspberry Pi in its fan case, across the robot (the top photo reads 78 to 90; the Pi's USB end faces right). A tape measure would settle it.

# Size pi_case_fb: name
Computer case, front to back

# Size pi_case_fb: note
Fan case, front to back (top photo: 72).

# Size pi_case_h: name
Computer case height with fan lid

# Size pi_case_h: note
Fan case height with its fan lid (side photo: 32 to 36).

# Size pi_case_x: name
Computer case centre, ahead of the axle midpoint

# Size pi_case_x: note
How far the case's centre sits ahead of the point midway between the axles (the top photo shows the case from 43 to 115 mm ahead).

# Size cam_l: name
Webcam length

# Size cam_l: note
eMeet C980 Pro webcam, end to end.

# Size cam_h: name
Webcam height

# Size cam_h: note
Webcam height (front photo: about 40).

# Size cam_d: name
Webcam depth

# Size cam_d: note
Webcam depth, front to back (top photo: 32).

# Size cam_lens_z: name
Lens centre above the floor

# Size cam_lens_z: note
Lens centre above the floor: the side photo reads 96 and the front photo 88 to 98. Older notes said 130.

# Size sensor_tilt: name
Distance sensor tipped back

# Size sensor_tilt: note
How far the distance sensor's face is tipped back from upright, in degrees.

# Size sensor_z: name
Distance sensor centres above the floor

# Size sensor_z: note
Height of the distance sensor's two round transducers above the floor (front photo: 41 mm above the lens).

# Size transducer_d: name
Distance sensor transducer diameter

# Size transducer_d: note
Diameter of each HC-SR04 transducer.

# Size transducer_pitch: name
Transducer centre to centre

# Size transducer_pitch: note
Transducer centre to centre (front photos: 26 to 26.7).

# Size catface_w: name
Cat-face bracket width

# Size catface_w: note
Width of the kit's acrylic cat-face bracket.

# Size catface_h: name
Cat-face bracket height

# Size catface_h: note
Height of the cat-face bracket to the tips of its ears.

# Size bank_l: name
Power bank length

# Size bank_l: note
Anker PowerCore Slim 10000 PD power bank, end to end; it lies across the robot.

# Size bank_w: name
Power bank width

# Size bank_w: note
Power bank width, front to back.

# Size bank_t: name
Power bank thickness

# Size bank_t: note
Power bank thickness; the rear photo agrees.

# Size bank_plate_back: name
Power bank plate back edge, from the axle midpoint

# Size bank_plate_back: note
How far the power bank plate's back edge sits behind the point midway between the axles (top photo; the bank itself reads 86 to 17 mm behind).

# Size bank_plate_fb: name
Power bank plate, front to back

# Size bank_plate_fb: note
Power bank plate, front to back.

# Size bank_plate_ac: name
Power bank plate, across

# Size bank_plate_ac: note
Power bank plate, across.

# Size bank_standoff: name
Power bank plate standoffs

# Size bank_standoff: note
Height of the stacked black standoffs under the power bank plate.

# Size cells_box_ac: name
Motor cell holder, across

# Size cells_box_ac: note
Two-cell 18650 holder, across the robot.

# Size cells_box_fb: name
Motor cell holder, front to back

# Size cells_box_fb: note
Two-cell 18650 holder, front to back.
