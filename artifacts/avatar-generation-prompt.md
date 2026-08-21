# Pet avatar standalone asset specification

Use case: background-extraction

Asset type: ten standalone transparent pet portraits for a calm pet-care web app

Source: the approved semi-photorealistic 5×2 portrait sheet, used only as identity and style source.

Subjects and fixed order:

- Orange tabby cat
- Silver-gray cat
- Black cat
- Golden retriever puppy
- Shiba Inu dog
- White poodle
- Cream lop-eared rabbit
- Golden hamster
- Green parrot
- Small green turtle

Composition/framing: one pet per 256×256 transparent PNG; subject visual height 210px; centered horizontally; shared bottom baseline at y=231; full ears, collar, chest, wings, shell, and limbs preserved where applicable.

Processing: identify the largest connected alpha subject around each source cell, keep only that subject, remove neighboring fragments, resize with premultiplied-alpha bilinear sampling, and place it on the standardized canvas.

Constraints: genuine alpha transparency; exactly one animal per file; no frame, no background, no neighboring fragments, no text, no labels, no logos, no watermark, no UI glyphs or controls.
