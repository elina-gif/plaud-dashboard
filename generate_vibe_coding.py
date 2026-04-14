from PIL import Image, ImageDraw, ImageFont

# ── Palette ──────────────────────────────────────────────────────────────────
BG          = (13,  17,  23)      # near-black background
RULE_COLOR  = (48,  54,  61)      # subtle horizontal rule
TITLE_COLOR = (230, 237, 243)     # bright white-ish for main title
HEAD_COLOR  = (88, 166, 255)      # blue for section headers [ … ]
QUOTE_COLOR = (163, 185, 138)     # soft green for quoted phrases
BODY_COLOR  = (139, 148, 158)     # muted grey for body text
ARROW_COLOR = (110, 118, 129)     # dimmer grey for arrows
ACCENT      = (255, 166,  77)     # orange accent for special labels
SUMMARY_BG  = (22,  27,  34)      # slightly lighter panel for summary box

# ── Fonts ─────────────────────────────────────────────────────────────────────
MONO_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
MONO_BOLD    = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
SANS_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANS_BOLD    = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def load(path, size):
    return ImageFont.truetype(path, size)

f_title   = load(SANS_BOLD,    52)
f_sub     = load(SANS_BOLD,    22)
f_head    = load(MONO_BOLD,    20)
f_body    = load(MONO_REGULAR, 17)
f_quote   = load(MONO_REGULAR, 17)
f_small   = load(SANS_REGULAR, 15)
f_summary_label = load(SANS_BOLD, 18)
f_summary_item  = load(MONO_BOLD,  19)

# ── Canvas dimensions ─────────────────────────────────────────────────────────
W = 1100
PAD = 70          # left/right padding
COL = W - PAD*2   # usable width

# ── Content definition ────────────────────────────────────────────────────────
# Each entry: (kind, text)
# kinds: title | subtitle | rule | arrow | spacer | header | body | quote | bullet | label | panel_open | panel_close

CONTENT = [
    ("spacer", 10),
    ("title",   "VIBE CODING"),
    ("subtitle","Language Evolution Path"),
    ("spacer",  14),
    ("rule",    ""),
    ("spacer",  28),

    ("header", "[ 1. Real behavior happens first ]"),
    ("spacer",  8),
    ("body",   "People start using AI to code in a new way:"),
    ("body",   "less manual writing, more prompting, steering, reviewing"),
    ("spacer",  22),
    ("arrow",  "↓"),
    ("spacer",  22),

    ("header", "[ 2. Dev / Builder layer ]"),
    ("spacer",  8),
    ("body",   "Early users describe it casually, jokingly, memetically"),
    ("spacer",  12),
    ("quote",  '"I barely code now."'),
    ("quote",  '"I just vibe code."'),
    ("quote",  '"Cursor wrote half of this."'),
    ("quote",  '"I\'m just prompting and shipping."'),
    ("spacer",  12),
    ("label",  "Characteristics:"),
    ("bullet", "informal  ·  funny  ·  low-stakes  ·  highly repeatable"),
    ("spacer",  22),
    ("arrow",  "↓"),
    ("spacer",  22),

    ("header", "[ 3. Community layer ]"),
    ("spacer",  8),
    ("body",   "The phrase gets copied, quoted, remixed, debated"),
    ("spacer",  12),
    ("body",   "devs reply with:"),
    ("bullet", '"same"'),
    ("bullet", '"this is so real"'),
    ("bullet", '"this is not real coding"'),
    ("bullet", '"future of software engineering"'),
    ("spacer",  12),
    ("label",  "What happens here:"),
    ("bullet", "meme spreads"),
    ("bullet", "controversy increases reach"),
    ("bullet", "identity starts forming"),
    ("spacer",  22),
    ("arrow",  "↓"),
    ("spacer",  22),

    ("header", "[ 4. Operator / Practitioner layer ]"),
    ("spacer",  8),
    ("body",   "The meme gets translated into practical workflow language"),
    ("spacer",  12),
    ("quote",  '"AI writes the first draft of the code."'),
    ("quote",  '"I spend less time typing, more time directing."'),
    ("quote",  '"The job is shifting from writing to judging."'),
    ("spacer",  12),
    ("label",  "What changes:"),
    ("bullet", "from joke  →  workflow"),
    ("bullet", "from vibe  →  productivity"),
    ("bullet", "from meme  →  real work behavior"),
    ("spacer",  22),
    ("arrow",  "↓"),
    ("spacer",  22),

    ("header", "[ 5. VC / Thought-leadership layer ]"),
    ("spacer",  8),
    ("body",   "The phenomenon gets abstracted into a market thesis"),
    ("spacer",  12),
    ("quote",  '"Code generation is changing engineering leverage."'),
    ("quote",  '"The bottleneck is shifting from production to judgment."'),
    ("quote",  '"Software development is moving from execution to orchestration."'),
    ("spacer",  12),
    ("label",  "What happens:"),
    ("bullet", "meme gets reinterpreted"),
    ("bullet", "behavior becomes thesis"),
    ("bullet", "category language starts forming"),
    ("spacer",  22),
    ("arrow",  "↓"),
    ("spacer",  22),

    ("header", "[ 6. Mainstream paradigm ]"),
    ("spacer",  8),
    ("body",   "What began as a joke becomes accepted language for a shift"),
    ("spacer",  12),
    ("quote",  '  vibe coding'),
    ("body",   '      ='),
    ("quote",  '  shorthand for a real change in how software gets built'),
    ("spacer",  30),

    ("rule",   ""),
    ("spacer",  30),

    # SHORT VERSION panel
    ("label",  "SHORT VERSION"),
    ("spacer",  16),
    ("summary_item", "Real behavior"),
    ("summary_arrow", "↓"),
    ("summary_item", "Dev meme"),
    ("summary_arrow", "↓"),
    ("summary_item", "Community spread"),
    ("summary_arrow", "↓"),
    ("summary_item", "Workflow language"),
    ("summary_arrow", "↓"),
    ("summary_item", "VC abstraction"),
    ("summary_arrow", "↓"),
    ("summary_item", "Paradigm"),
    ("spacer",  30),

    ("rule",   ""),
    ("spacer",  28),

    ("label",  "ONE-LINE SUMMARY"),
    ("spacer",  12),
    ("body",   "Vibe coding did not go viral because it was a clever phrase."),
    ("body",   "It went viral because it named a real behavior,"),
    ("body",   "then got adopted differently by each layer of the market."),
    ("spacer",  30),
]

# ── Measure total height ──────────────────────────────────────────────────────
def text_h(font, text="Ay"):
    dummy = Image.new("RGB", (1, 1))
    d = ImageDraw.Draw(dummy)
    bb = d.textbbox((0, 0), text, font=font)
    return bb[3] - bb[1]

def measure_height():
    h = PAD  # top padding
    for kind, val in CONTENT:
        if kind == "spacer":
            h += val
        elif kind == "title":
            h += text_h(f_title, val) + 4
        elif kind == "subtitle":
            h += text_h(f_sub, val) + 4
        elif kind == "rule":
            h += 3
        elif kind == "arrow":
            h += text_h(f_head, val)
        elif kind in ("header",):
            h += text_h(f_head, val)
        elif kind in ("body", "label"):
            h += text_h(f_body, val)
        elif kind in ("quote",):
            h += text_h(f_quote, val)
        elif kind == "bullet":
            h += text_h(f_body, val)
        elif kind in ("summary_item",):
            h += text_h(f_summary_item, val)
        elif kind == "summary_arrow":
            h += text_h(f_body, val)
    h += PAD  # bottom padding
    return h

H = measure_height()

# ── Draw ──────────────────────────────────────────────────────────────────────
img = Image.new("RGB", (W, H), BG)
d   = ImageDraw.Draw(img)

def draw_text(x, y, text, font, color, align="left"):
    if align == "center":
        bb = d.textbbox((0, 0), text, font=font)
        tw = bb[2] - bb[0]
        x = (W - tw) // 2
    d.text((x, y), text, font=font, fill=color)
    bb = d.textbbox((x, y), text, font=font)
    return bb[3] - bb[1]

y = PAD
INDENT_QUOTE  = PAD + 40
INDENT_BULLET = PAD + 52
INDENT_ARROW  = W // 2

for kind, val in CONTENT:
    if kind == "spacer":
        y += val
        continue

    if kind == "title":
        h = draw_text(0, y, val, f_title, TITLE_COLOR, align="center")
        y += h + 4

    elif kind == "subtitle":
        h = draw_text(0, y, val, f_sub, ARROW_COLOR, align="center")
        y += h + 4

    elif kind == "rule":
        d.rectangle([PAD, y+1, W-PAD, y+2], fill=RULE_COLOR)
        y += 3

    elif kind == "arrow":
        h = draw_text(INDENT_ARROW, y, val, f_head, ARROW_COLOR)
        y += h

    elif kind == "header":
        h = draw_text(PAD, y, val, f_head, HEAD_COLOR)
        y += h

    elif kind == "body":
        h = draw_text(PAD, y, val, f_body, BODY_COLOR)
        y += h

    elif kind == "label":
        h = draw_text(PAD, y, val, f_body, ACCENT)
        y += h

    elif kind == "quote":
        h = draw_text(INDENT_QUOTE, y, val, f_quote, QUOTE_COLOR)
        y += h

    elif kind == "bullet":
        # small bullet glyph
        d.text((INDENT_BULLET - 18, y + 3), "–", font=f_body, fill=ARROW_COLOR)
        h = draw_text(INDENT_BULLET, y, val, f_body, BODY_COLOR)
        y += h

    elif kind == "summary_item":
        h = draw_text(0, y, val, f_summary_item, TITLE_COLOR, align="center")
        y += h

    elif kind == "summary_arrow":
        h = draw_text(INDENT_ARROW, y, val, f_body, ARROW_COLOR)
        y += h

# ── Save ──────────────────────────────────────────────────────────────────────
OUT = "/home/user/plaud-dashboard/vibe_coding_diagram.png"
img.save(OUT, "PNG")
print(f"Saved → {OUT}  ({W}×{H})")
