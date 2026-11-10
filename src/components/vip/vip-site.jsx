/* src/components/vip/vip-site.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   FF VIP (v17.3.128) — the fourth FireFlair site, at ffvip.uk.
   Role "vip" in this prototype. State lives under state.vip21:
     card      the member's VIP card (name, photo, drinks, diet, allergies, vibes, care, seat, savedAt)
     guest     the launch party guest list entry ({ ref, at }); creating a VIP card joins the list
     invites   invitations a host has made for their own events
     bookings  VIP booking requests sent to venues (also saved to Front Doors requests for FF Admin)
   Pages (the same four tabs as the other sites): Home, Experiences, Book, My card.
   Copied from the other sites: the dark promo box (ff-cp20), the shine button, Sheet, collapsible
   FAQ boxes, Front Doors requests. Nothing here takes a payment or sends a message: wallet
   passes, invitations and the points system are shown, and built for real later.
   ========================================================================== */
const VIP21 = {
  domain: "ffvip.uk",
  party: { place: "Shoreditch, London", when: "Early 2027" },
  slug: (state) => {
    const c = (state.vip21 || {}).card || {};
    const raw = (state.session && state.session.tag) || c.name || "";
    return String(raw).toLowerCase().replace(/[^a-z0-9]+/g, "") || "you";
  },
};


const VIP21_DRINKS = ["Champagne", "Prosecco", "Espresso Martini", "Old Fashioned", "Negroni", "Margarita", "Mezcal Paloma", "Gin Martini", "Vodka Martini", "Aperol Spritz", "French 75", "Moscow Mule", "Gin and tonic", "Whisky, neat", "Tequila, neat", "Red wine", "White wine", "Rosé", "Craft beer", "Alcohol-free cocktails"];


const VIP21_DIET = ["Vegetarian", "Vegan", "Pescatarian", "Gluten free", "Dairy free", "Halal", "Kosher", "Nut allergy", "Shellfish allergy", "Egg allergy"];


const VIP21_VIBES = ["Life of the party", "Relaxed and quiet", "Loves a toast", "Always on time", "Likes a surprise", "Prefers no fuss", "Here to celebrate", "Hosting guests"];


const VIP21_SEATS = ["The best table in the house", "A booth", "At the bar", "Outside", "Somewhere private", "Wherever suits"];


const VIP21_MENU = ["Espresso Martini", "Margarita", "Old Fashioned", "Negroni", "Aperol Spritz", "French 75", "Moscow Mule", "Champagne, by the glass"];


const VIP21_OCCASIONS = ["Birthday", "Anniversary", "Celebration", "Corporate", "Group night out", "Just because"];


const VIP21_EXP = [
  { k: "spa", t: "Spas and wellness", s: "Thermal suites, treatments and slow days away", img: "cocktail_0", area: "Surrey Hills", ll: [51.23, -0.33], d: "Day spas, hotel spas and wellness retreats for a pair, a group or a celebration.", f: "Good for pairs, hen weekends and birthdays." },
  { k: "track", t: "Racetracks and driving", s: "Track days, passenger laps and hospitality suites", img: "dream_motorsport", area: "Northamptonshire", ll: [52.07, -1.02], d: "Circuits, driving experiences and trackside hospitality, with your group looked after all day.", f: "Good for groups, corporate days and big birthdays." },
  { k: "dine", t: "Fine dining", s: "Tasting menus and chef\u2019s tables", img: "cocktail_2", area: "Mayfair", ll: [51.511, -0.147], d: "The restaurants worth booking early, with your preferences already at the table.", f: "Good for anniversaries, dinners and celebrations." },
  { k: "roof", t: "Rooftops and cocktail bars", s: "The best tables, and the best bartenders", img: "dream_after_dark", area: "Shoreditch", ll: [51.526, -0.078], d: "Choose your drinks ahead and ask for the bartender you want behind the bar.", f: "Good for groups, first dates and nights out." },
  { k: "priv", t: "Private dining and rooms", s: "Your own room, menu and host", img: "t17_vkg09", area: "Marylebone", ll: [51.52, -0.153], d: "Private rooms and buyouts for dinners, launches and celebrations.", f: "Good for launches, birthdays and corporate dinners." },
  { k: "tea", t: "Afternoon tea and brunch", s: "A long table and a good reason", img: "cocktail_1", area: "Knightsbridge", ll: [51.502, -0.16], d: "Afternoon tea, bottomless brunch and long lunches for groups.", f: "Good for hen parties, baby showers and catch-ups." },
  { k: "water", t: "Yachts and river cruises", s: "Days and evenings on the water", img: "dream_yacht_jobs", area: "Westminster Pier", ll: [51.501, -0.122], d: "Charters and cruises with the bar and the team arranged for you.", f: "Good for summer parties and milestone birthdays." },
  { k: "hotel", t: "Hotels and suites", s: "A room, a bar and a table in one booking", img: "reward_training_tickets", area: "Covent Garden", ll: [51.512, -0.123], d: "Stay, dine and drink at the same address, with one card for all of it.", f: "Good for weekends away and special occasions." },
  { k: "wine", t: "Wine, whisky and tastings", s: "Cellars, distilleries and guided tastings", img: "training_wine_qualification", area: "Kent", ll: [51.28, 0.52], d: "Tastings led by the people who make it, for a few friends or a full group.", f: "Good for friends, couples and corporate groups." },
  { k: "show", t: "Shows, sport and nights out", s: "Boxes, tables and after-parties", img: "dream_sports_events", area: "West End", ll: [51.513, -0.131], d: "The best seats and the best tables for a night out.", f: "Good for groups and client entertaining." },
  { k: "estate", t: "Gardens and country estates", s: "Houses, grounds and long weekends", img: "t17_vkg11", area: "Hertfordshire", ll: [51.78, -0.2], d: "Country houses and gardens for celebrations that need space.", f: "Good for weddings, big parties and long weekends." },
  { k: "club", t: "Members\u2019 clubs", s: "Doors that open when you are known", img: "reward_amex_card", area: "St James\u2019s", ll: [51.507, -0.137], d: "Clubs and lounges, where being known on arrival is the whole point.", f: "Good for regulars, hosts and private evenings." },
];


const VIP21_STEPS = [
  ["Create your VIP card", "Your favourite drinks, what you eat, how you like to be looked after."],
  ["Host or be invited", "Hosts turn their Event Card into an invitation. Guests reply with their card."],
  ["Book VIP", "Venues receive your card, not just a phone number."],
  ["Arrive and be known", "Add your card to your wallet and show it at the door."],
];


const VIP21_FAQ = [
  ["Who sees my VIP card?", "Only the venue you book, and only when you send a booking. You choose what is on your card, and you can change it at any time."],
  ["Is it free?", "Creating a VIP card is free."],
  ["What is the launch party?", "The FireFlair launch party, in Shoreditch in early 2027. It is by invitation. Guests create a VIP card to be on the guest list, so we know who is coming and what to have ready for them."],
  ["Which venues can I book?", "FireFlair finds and shows the best experiences and hospitality, with a focus on luxury. Venues join through FF Staff, and the list grows as they do."],
  ["What are FF Rewards?", "Reward points for bringing people to FireFlair. The more people you bring, the more you earn. The points system opens later, and what you share before then counts."],
  ["Do I need FF Team or FF Party?", "No. FF VIP is for guests. If you work in hospitality, FF Team is where you build a profile and get booked."],
];


const VIP21_CSS = [
  ".ff-v21{--vp:#D9DCE2;--vp2:#9EA3AD;--vk:#0B0B0D}",
  ".ff-v21-hero{position:relative;margin:0 0 6px;border-radius:0 0 34px 34px;overflow:hidden;background:radial-gradient(120% 90% at 85% 0%,#3a3f4b 0%,#17181c 48%,#0B0B0D 100%);color:#F4F2EC;padding:38px 22px 30px;isolation:isolate}",
  ".ff-v21-hero:before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(115deg,transparent 56%,rgba(217,220,226,.12) 56.2%,rgba(217,220,226,.12) 58%,transparent 58.2%)}",
  ".ff-v21-hero-in{display:grid;gap:22px;max-width:1040px;margin:0 auto}",
  ".ff-v21-eye{display:flex;align-items:center;gap:12px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--vp);font-weight:600}",
  ".ff-v21-eye img{width:46px;height:46px;border-radius:50%;object-fit:cover}",
  ".ff-v21-hero h1{margin:6px 0 10px;font-size:clamp(34px,9vw,60px);line-height:1.02;font-weight:600;color:#fff}",
  ".ff-v21-hero p{margin:0 0 8px;font-size:16.5px;line-height:1.5;color:rgba(244,242,236,.86);max-width:560px}",
  ".ff-v21-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}",
  ".ff-v21-hero-pic{position:relative;border-radius:30px;overflow:hidden;aspect-ratio:4/3;border:1px solid rgba(217,220,226,.4)}",
  ".ff-v21-hero-pic img{width:100%;height:100%;object-fit:cover;display:block}",
  "@media(min-width:900px){.ff-v21-hero{padding:56px 40px 46px}.ff-v21-hero-in{grid-template-columns:1.1fr 1fr;align-items:center;gap:40px}}",
  ".ff-v21-sect{margin:26px 0}",
  ".ff-v21-sect h2{margin:0 0 6px;font-size:clamp(24px,5.6vw,34px);line-height:1.1}",
  ".ff-v21-lead{margin:0 0 14px;font-size:15.5px;line-height:1.5;max-width:640px}",
  ".ff-v21 .ff-cp20{background:linear-gradient(135deg,#0B0B0D 0%,#1c1d22 55%,#3a3f4b 100%);border-color:rgba(217,220,226,.45)}",
  ".ff-v21 .ff-cp20-eye,.ff-v21 .ff-cp20-date,.ff-v21 .ff-cp20-url,.ff-v21 .ff-cp20 .ff-cp20-box span{color:#D9DCE2}",
  ".ff-v21 .ff-cp20-date,.ff-v21 .ff-cp20 .ff-cp20-box{border-color:rgba(217,220,226,.5)}",
  ".ff-v21-guest{display:inline-flex;align-items:center;gap:8px;margin:6px 0 4px;padding:7px 14px;border-radius:16px;background:rgba(217,220,226,.14);border:1px solid rgba(217,220,226,.6);font-weight:600;font-size:13.5px;color:#fff}",
  ".ff-v21-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}",
  ".ff-v21-steps li{display:flex;gap:12px;padding:16px;border-radius:24px;border:1px solid rgba(165,128,47,.4);background:#FBF7EC;color:var(--onyx,#141416)}",
  ".ff-v21-steps .n{flex:none;width:30px;height:30px;border-radius:50%;background:var(--onyx,#141416);color:#E7CB7A;display:grid;place-items:center;font-weight:700;font-size:14px}",
  ".ff-v21-steps b{display:block;font-size:15.5px;margin-bottom:2px}.ff-v21-steps small{display:block;font-size:13px;line-height:1.4;color:#4a463e}",
  ".ff-v21-split{display:grid;gap:20px;align-items:center}",
  "@media(min-width:900px){.ff-v21-split{grid-template-columns:1fr 1fr;gap:36px}}",
  ".ff-vc21{position:relative;width:100%;max-width:440px;min-height:236px;gap:14px;border-radius:28px;padding:20px 22px;overflow:hidden;color:#F4F2EC;background:linear-gradient(135deg,#0B0B0D 0%,#25262c 52%,#4a4f5b 100%);border:1px solid rgba(217,220,226,.55);box-shadow:0 18px 40px rgba(0,0,0,.35);isolation:isolate;display:flex;flex-direction:column;justify-content:space-between}",
  ".ff-vc21:before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(115deg,transparent 60%,rgba(217,220,226,.14) 60.2%,rgba(217,220,226,.14) 62.5%,transparent 62.7%)}",
  ".ff-vc21-top{display:flex;align-items:center;justify-content:space-between;gap:10px}",
  ".ff-vc21-top img.lg{width:44px;height:44px;border-radius:50%;object-fit:cover}",
  ".ff-vc21-top span{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#D9DCE2;font-weight:600}",
  ".ff-vc21-mid{display:flex;gap:14px;align-items:center;min-width:0}",
  ".ff-vc21-ph{flex:none;width:68px;height:68px;border-radius:22px;background:#2f3138 center/cover;border:1px solid rgba(217,220,226,.5);display:grid;place-items:center;color:#D9DCE2}",
  ".ff-vc21-nm{min-width:0}.ff-vc21-nm b{display:block;font-size:clamp(19px,5.4vw,25px);line-height:1.1;color:#fff;overflow-wrap:anywhere}.ff-vc21-nm small{display:block;margin-top:3px;font-size:12px;color:#D9DCE2;letter-spacing:.06em}",
  ".ff-vc21-rows{display:grid;gap:6px;font-size:12.5px;line-height:1.35}.ff-vc21-rows div{display:flex;gap:8px;align-items:baseline}.ff-vc21-rows em{flex:none;font-style:normal;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#9EA3AD;min-width:56px}",
  ".ff-vc21-bot{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}",
  ".ff-vc21-qr{flex:none;width:46px;height:46px;border-radius:10px;background:#F4F2EC;padding:4px}",
  ".ff-v21-cardwrap{display:flex;flex-direction:column;gap:14px;align-items:flex-start}",
  ".ff-v21-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}.ff-v21-list li{display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.4}.ff-v21-list li svg{flex:none;margin-top:2px;color:var(--gold-dk,#A5802F)}",
  ".ff-v21-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}",
  ".ff-v21 .ff-v21-tile{display:flex;flex-direction:column;gap:6px;text-align:left;padding:16px;border-radius:26px;border:1px solid rgba(165,128,47,.45);background:linear-gradient(160deg,#17181c,#25262c);color:#F4F2EC;cursor:pointer;font:inherit;min-height:132px;position:relative;overflow:hidden}",
  ".ff-v21 .ff-v21-tile .ic{width:38px;height:38px;border-radius:14px;display:grid;place-items:center;background:rgba(217,220,226,.12);border:1px solid rgba(217,220,226,.4);color:#E9EBEF}",
  ".ff-v21 .ff-v21-tile b{font-size:16px;line-height:1.2;color:#fff}.ff-v21 .ff-v21-tile span.s{font-size:12.5px;line-height:1.35;color:#C5C8CF}",
  ".ff-v21-tile:hover,.ff-v21-tile:focus-visible{border-color:#E7CB7A;outline:none}",
  ".ff-v21-dark{border-radius:26px;padding:22px;background:linear-gradient(135deg,#0B0B0D,#1c1d22 60%,#3a3f4b);color:#F4F2EC;border:1px solid rgba(217,220,226,.4)}",
  ".ff-v21 .ff-v21-dark h2,.ff-v21 .ff-v21-dark h3{color:#fff}.ff-v21 .ff-v21-dark p{color:rgba(244,242,236,.88);font-size:15px;line-height:1.5;margin:0 0 8px}",
  ".ff-v21-link{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0}.ff-v21-link code{padding:8px 14px;border-radius:16px;background:rgba(244,242,236,.1);border:1px solid rgba(217,220,226,.5);font-size:14px;color:#fff;overflow-wrap:anywhere}",
  ".ff-v21-faq{display:grid;gap:8px}.ff-v21-faq details{border-radius:20px;border:1px solid rgba(165,128,47,.4);background:#FBF7EC;color:var(--onyx,#141416);padding:0 16px}",
  ".ff-v21-faq summary{cursor:pointer;list-style:none;padding:14px 0;font-weight:600;font-size:15px;display:flex;justify-content:space-between;gap:10px}.ff-v21-faq summary::-webkit-details-marker{display:none}",
  ".ff-v21-faq summary:after{content:'+';font-size:20px;line-height:1;color:#A5802F}.ff-v21-faq details[open] summary:after{content:'\\2212'}",
  ".ff-v21-faq p{margin:0 0 14px;font-size:14.5px;line-height:1.5;color:#3a372f}",
  ".ff-v21-form{display:grid;gap:16px;padding:18px;border-radius:26px;background:#FBF7EC;border:1px solid rgba(165,128,47,.45);color:var(--onyx,#141416)}",
  ".ff-v21-form h2,.ff-v21-form h3{margin:0}.ff-v21-form h3{font-size:16px}",
  ".ff-v21-row{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}",
  ".ff-v21-chips{display:flex;flex-wrap:wrap;gap:8px}.ff-v21-chip{padding:8px 14px;border-radius:18px;border:1px solid rgba(165,128,47,.55);background:#fff;color:var(--onyx,#141416);font:inherit;font-size:13.5px;cursor:pointer}.ff-v21-chip[aria-pressed=true]{background:var(--onyx,#141416);color:#E7CB7A;border-color:var(--onyx,#141416)}",
  ".ff-v21-in{width:100%;padding:11px 14px;border-radius:16px;border:1px solid rgba(165,128,47,.55);background:#fff;font:inherit;font-size:15px;color:var(--onyx,#141416)}",
  ".ff-v21-k{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6b5a2b;font-weight:600;margin-bottom:6px}",
  ".ff-v21-menu{display:grid;gap:8px}.ff-v21-menu div{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 14px;border-radius:18px;background:#fff;border:1px solid rgba(165,128,47,.35);font-size:14.5px}",
  ".ff-v21-step{display:inline-flex;align-items:center;gap:10px}.ff-v21-step button{width:32px;height:32px;border-radius:50%;border:1px solid rgba(165,128,47,.7);background:#fff;font-size:18px;line-height:1;cursor:pointer;color:var(--onyx,#141416)}.ff-v21-step b{min-width:22px;text-align:center;font-variant-numeric:tabular-nums}",
  ".ff-v21-sw{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:20px;background:#fff;border:1px solid rgba(165,128,47,.35);cursor:pointer;text-align:left;font:inherit;color:var(--onyx,#141416);width:100%}",
  ".ff-v21-sw b{display:block;font-size:14.5px}.ff-v21-sw small{display:block;font-size:12.5px;color:#4a463e}",
  ".ff-v21-sw i{flex:none;width:44px;height:26px;border-radius:14px;background:#C9C4B6;position:relative;transition:background .15s}.ff-v21-sw i:after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .15s}",
  ".ff-v21-sw[aria-pressed=true] i{background:var(--onyx,#141416)}.ff-v21-sw[aria-pressed=true] i:after{left:21px}",
  ".ff-v21-done{padding:16px;border-radius:22px;background:#EFE7CF;border:1px solid rgba(165,128,47,.55);color:var(--onyx,#141416)}.ff-v21-done b{display:block;font-size:16px;margin-bottom:4px}",
  ".ff-v21-inv{display:grid;gap:10px}.ff-v21-inv>div{padding:14px;border-radius:22px;background:#fff;border:1px solid rgba(165,128,47,.4);color:var(--onyx,#141416)}.ff-v21-inv b{display:block;font-size:15.5px}.ff-v21-inv small{display:block;color:#4a463e;font-size:13px;margin:2px 0 8px}",
  ".ff-v21-wallet{display:grid;gap:10px;margin-top:10px}.ff-v21-wallet button{display:flex;align-items:center;gap:10px;justify-content:center;padding:13px 16px;border-radius:20px;border:0;background:#000;color:#fff;font:inherit;font-weight:600;cursor:pointer}",
  ".ff-v21-ph2{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.ff-v21-ph2 .ff-v21-up{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:18px;border:1px solid rgba(165,128,47,.6);background:#fff;cursor:pointer;font-size:14px}",
  ".ff-v21 .ff-btn{border-radius:18px}",
  ".ff-v21 .ff-v21-chips .ff-v21-chip{padding:8px 14px;border-radius:18px;border:1px solid rgba(165,128,47,.55);background:#fff;color:var(--onyx,#141416);font:inherit;font-size:13.5px;cursor:pointer}.ff-v21 .ff-v21-chips .ff-v21-chip[aria-pressed=true]{background:var(--onyx,#141416);color:#E7CB7A;border-color:var(--onyx,#141416)}",
  ".ff-v21 .ff-vcard21 .r span:not(.ic){overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.ff-v21 .ff-vcard21 .r .ph0{opacity:.5}",
  ".ff-v21 .ff-vcard21 .vq{position:absolute;right:10px;top:44px;z-index:3;width:44px;height:44px;padding:4px;border-radius:8px;background:#fff;display:block}.ff-v21 .ff-vcard21 .vq svg{width:100%;height:100%;display:block}",
  ".ff-v21 .ff-vcard21.mini{width:100%}.ff-v21 .ff-vcard21.mini .vq{display:none}",
  ".ff-v21 .ff-v21-pc{flex:none;width:220px;padding:0;border:0;background:none;cursor:pointer;font:inherit;text-align:left}",
  ".ff-v21 .ff-v21-xg{margin-top:14px}.ff-v21 .ff-v21-gh{margin:0 0 10px;font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-dk,#8A6A1F)}",
  ".ff-v21 .ff-v21-xl{display:grid;gap:12px;grid-template-columns:1fr}@media(min-width:760px){.ff-v21 .ff-v21-xl{grid-template-columns:1fr 1fr}}",
  ".ff-v21 .ff-v21-xp{border-radius:26px;overflow:hidden;background:#fff;border:1px solid rgba(165,128,47,.45);box-shadow:0 10px 24px -18px rgba(30,20,5,.6)}",
  ".ff-v21 .ff-v21-xp .h{display:flex;align-items:center;gap:14px;width:100%;padding:10px 14px 10px 10px;border:0;background:none;color:var(--onyx,#141416);text-align:left;cursor:pointer;font:inherit}",
  ".ff-v21 .ff-v21-xp .pic{flex:none;width:84px;height:84px;border-radius:20px;overflow:hidden;background:#17181c;display:block}.ff-v21 .ff-v21-xp .pic img{width:100%;height:100%;object-fit:cover;display:block}",
  ".ff-v21 .ff-v21-xp .tx{flex:1;min-width:0;display:grid;gap:3px}.ff-v21 .ff-v21-xp .tx b{font-size:16px;line-height:1.2;color:var(--onyx,#141416)}.ff-v21 .ff-v21-xp .tx small{font-size:12.5px;line-height:1.35;color:#555}",
  ".ff-v21 .ff-v21-xp .cv{flex:none;transition:transform .2s;color:#8A6A1F}.ff-v21 .ff-v21-xp.on .cv{transform:rotate(180deg)}",
  ".ff-v21 .ff-v21-xp .b{padding:2px 16px 16px;color:#2a2a2e}.ff-v21 .ff-v21-xp .b p{margin:6px 0;font-size:14.5px;line-height:1.5}.ff-v21 .ff-v21-xp .b .f{font-size:13px;color:#6b5a2a}",
  ".ff-v21 .ff-v21-xsel{flex:none;width:170px;display:grid;gap:4px;text-align:left;padding:0 0 12px;border-radius:22px;overflow:hidden;border:2px solid rgba(165,128,47,.4);background:#fff;color:var(--onyx,#141416);cursor:pointer;font:inherit}",
  ".ff-v21 .ff-v21-xsel[aria-pressed=true]{border-color:var(--gold-mid,#B08D2A);box-shadow:0 0 0 3px rgba(231,203,122,.5)}",
  ".ff-v21 .ff-v21-xsel .pic{display:block;height:104px;background:#17181c}.ff-v21 .ff-v21-xsel .pic img{width:100%;height:100%;object-fit:cover;display:block}",
  ".ff-v21 .ff-v21-xsel b{padding:0 12px;font-size:14.5px;line-height:1.2}.ff-v21 .ff-v21-xsel small{padding:0 12px;font-size:12px;line-height:1.3;color:#555}",
  ".ff-v21 .ff-v21-map{position:relative;border-radius:26px;overflow:hidden;border:1px solid rgba(165,128,47,.5);background:#C9DDB0}.ff-v21 .ff-v21-map .box{height:340px;width:100%}",
  ".ff-v21 .ff-v21-map .zm{position:absolute;right:10px;top:10px;z-index:500;display:grid;gap:6px}.ff-v21 .ff-v21-map .zm button{width:38px;height:38px;border-radius:14px;border:1px solid rgba(165,128,47,.6);background:#fff;color:var(--onyx,#141416);font-size:18px;cursor:pointer}",
  ".ff-v21-pin span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;font-weight:700;font-size:13px;border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.4)}.ff-v21-pin .v{background:#17181c;color:#F4DC8E}.ff-v21-pin .x{background:linear-gradient(170deg,#F8E9B4,#D9B451);color:#16130F}",
  ".ff-v21 .ff-v21-sel{display:flex;align-items:center;gap:12px;margin-top:12px;padding:10px;border-radius:22px;background:#fff;border:1px solid rgba(165,128,47,.45)}.ff-v21 .ff-v21-sel .pic{flex:none;width:56px;height:56px;border-radius:16px;overflow:hidden;background:#17181c}.ff-v21 .ff-v21-sel .pic img{width:100%;height:100%;object-fit:cover}.ff-v21 .ff-v21-sel .tx{flex:1;min-width:0;display:grid}.ff-v21 .ff-v21-sel small{color:#555}",
  ".ff-v21 .ff-v21-media{display:flex;flex-wrap:wrap;gap:10px}.ff-v21 .ff-v21-media .m{position:relative;width:96px;height:96px;border-radius:18px;overflow:hidden}.ff-v21 .ff-v21-media .m img{width:100%;height:100%;object-fit:cover}.ff-v21 .ff-v21-media .m button{position:absolute;top:4px;right:4px;width:24px;height:24px;border-radius:50%;border:0;background:rgba(0,0,0,.65);color:#fff;display:grid;place-items:center;cursor:pointer}.ff-v21 .ff-v21-media .add{width:96px;height:96px;border-radius:18px;border:2px dashed rgba(165,128,47,.7);background:none;color:#8A6A1F;display:grid;place-items:center;cursor:pointer}",
  ".ff-v21 .ff-v21-link{background:none;border:0;padding:0;color:#8A6A1F;font:inherit;font-weight:700;text-decoration:underline;cursor:pointer}",
  ".ff-v21-div{display:flex;align-items:center;gap:14px;margin:6px 0}.ff-v21-div i{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(165,128,47,.7),transparent)}",
].join("");


function VipShine21({ onClick, children }) {
  return (
    <button type="button" className="ff-btn ff-shine" onClick={onClick}>
      <i className="sp s1" aria-hidden="true" /><i className="sp s2" aria-hidden="true" /><i className="sp s3" aria-hidden="true" />
      <span className="lab">{children}</span>
    </button>
  );
}


function vipJoin21(list) {
  return list.flatMap((s, i) => (i ? [<div key={"d" + i} className="ff-v21-div" aria-hidden="true"><i /><Coin size={26} tier="gold" /><i /></div>, s] : [s]));
}


const VIP21_PROMO_A = ".ff-cp20{position:relative;margin:22px 0;border-radius:26px;overflow:hidden;color:#F4EBD6;background:linear-gradient(135deg,#0B0A09 0%,#1C0E12 55%,#4A1220 100%);border:1px solid rgba(201,162,75,.45);isolation:isolate}"
    + ".ff-cp20:before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(115deg,transparent 58%,rgba(201,162,75,.16) 58.2%,rgba(201,162,75,.16) 60%,transparent 60.2%)}"
    + ".ff-cp20-in{display:grid;grid-template-columns:1.25fr 1fr;gap:18px;align-items:center;padding:22px}"
    + ".ff-cp20-eye{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#D9B968;font-weight:600}"
    + ".ff-cp20 h2{margin:8px 0 6px;font-size:clamp(22px,4.6vw,32px);line-height:1.12;color:#F4EBD6}"
    + ".ff-cp20 p{margin:0 0 6px;font-size:14.5px;line-height:1.45;color:rgba(244,235,214,.88)}"
    + ".ff-cp20-date{display:inline-block;margin:4px 0 10px;padding:5px 12px;border-radius:14px;border:1px solid rgba(201,162,75,.6);color:#D9B968;font-weight:600;font-size:13px}"
    + ".ff-cp20-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}"
    + ".ff-cp20-pics{display:grid;grid-template-columns:1fr 1fr;gap:8px}"
    + ".ff-cp20-pics span{display:block;aspect-ratio:1/1;border-radius:16px;background-size:cover;background-position:center;border:1px solid rgba(201,162,75,.35)}"
    + ".ff-cp20-url{margin-top:8px;font-size:12px;letter-spacing:.08em;color:#D9B968;text-align:center}"
    + "@media(max-width:640px){.ff-cp20-in{grid-template-columns:1fr;padding:18px}.ff-cp20-pics{grid-template-columns:repeat(4,1fr)}}"
    + ".ff-cp20r h3{margin:16px 0 4px;font-size:15px}.ff-cp20r p,.ff-cp20r li{font-size:14px;line-height:1.5;margin:0 0 6px}.ff-cp20r ul,.ff-cp20r ol{margin:0;padding-left:20px}"
    + ".ff-cp20r .tbc{display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border-radius:12px;border:1px dashed var(--gold-dk,#A5802F);font-size:12.5px}"
    + ".ff-vip20-ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:6px}.ff-vip20-ul li{padding:7px 10px;border-radius:14px;border:1px solid rgba(201,162,75,.4);font-size:12px;line-height:1.3;color:#F4EBD6}";


const VIP21_PROMO_B = ".ff-cp20 .ff-cp20-boxes{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ff-cp20 .ff-cp20-box{display:flex;flex-direction:column;gap:3px;text-align:left;padding:14px 14px;border-radius:18px;border:1px solid rgba(201,162,75,.45);background:rgba(244,235,214,.05);color:#F4EBD6;cursor:pointer;font:inherit;min-height:84px}.ff-cp20 .ff-cp20-box b{font-size:15px;line-height:1.2;color:#F4EBD6}.ff-cp20 .ff-cp20-box span{font-size:12.5px;line-height:1.3;color:#D9B968}.ff-cp20 .ff-cp20-box:hover,.ff-cp20 .ff-cp20-box:focus-visible{background:rgba(201,162,75,.14);outline:none}.ff-cp20.big .ff-cp20-in{grid-template-columns:1fr;gap:20px;padding:30px 26px}.ff-cp20.big h2{font-size:clamp(30px,7vw,48px);line-height:1.05;margin:10px 0 10px}.ff-cp20.big p{font-size:16.5px}.ff-cp20.big .ff-cp20-eye{font-size:13px}.ff-cp20.big .ff-cp20-box{min-height:96px;padding:16px}.ff-cp20.big .ff-cp20-box b{font-size:16.5px}@media(min-width:900px){.ff-cp20.big .ff-cp20-in{grid-template-columns:1.1fr 1fr;padding:40px 36px;align-items:center}}";


const VIP21_IC = {};


const vipIcon21 = (n) => VIP21_IC[n] || (VIP21_IC[n] = lucideIcon(n));


const vipPatch21 = (dispatch, state, patch) => dispatch({ type: "V11_SET", patch: { vip21: { ...(state.vip21 || {}), ...patch } } });


const vipImg21 = (k) => (window.FF_IMG && window.FF_IMG[k]) || "";


const vipCardDone21 = (v) => !!(v && v.card && v.card.savedAt && String(v.card.name || "").trim());


const vipRef21 = (p) => p + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();


function vipGo21(dispatch, tab, id) {
  dispatch({ type: "TAB", tab });
  window.scrollTo(0, 0);
  if (id) setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
}


function vipShare21(text) { window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener"); }


function vipCopy21(dispatch, text) {
  try { navigator.clipboard.writeText(text).then(() => dispatch({ type: "TOAST", toast: "Link copied" }), () => dispatch({ type: "TOAST", toast: text })); }
  catch (e) { dispatch({ type: "TOAST", toast: text }); }
}


/* A small deterministic QR-style block for the card; the real one carries the signed card address. */
function VipQr21({ seed }) {
  const s = String(seed || "ffvip");
  let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const cells = [];
  for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const eye = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
    if (eye || (h >>> 16) & 1) cells.push(<rect key={x + "-" + y} x={x} y={y} width="1" height="1" />);
  }
  return <svg className="ff-vc21-qr" viewBox="0 0 9 9" fill="#0B0B0D" aria-hidden="true">{cells}</svg>;
}


/* The VIP card: the same 5:7 card as the VIP Host Card, mostly their photo. */
function VipCard21({ card, tag, sample, edit, set, mini }) {
  const c = card || {};
  const ref = useRef(null);
  const Wine = vipIcon21("Wine"), Heart = vipIcon21("Heart"), Spark = vipIcon21("Sparkles"), Leaf = vipIcon21("Leaf");
  const src = vipPhoto21(c);
  const pick = (e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f || !set) return; if (f.size > MAX_MEDIA_BYTES) return; readFileAsDataUrl(f).then(u => set({ photo: u })).catch(() => {}); };
  const list = (a) => (a || []).slice(0, 3).join(" · ");
  const diet = [list(c.diet), c.allergies].filter(Boolean).join(" · ");
  const row = (Icon, label, text) => <div className="r"><span className="ic"><Icon size={13} /></span><span className={text ? "" : "ph0"}>{text || label}</span></div>;
  return (
    <div className={`ff-pcard11 ff-vcard21${mini ? " mini" : ""}`} role={edit ? undefined : "img"} aria-label={edit ? undefined : `VIP card for ${c.name || "you"}`}>
      <span className="plate">VIP Card{sample ? " · Example" : ""}</span>
      <span className="coin"><Coin size={28} tier="gold" /></span>
      {React.createElement(edit ? "button" : "div", edit ? { type: "button", className: "ph", onClick: () => ref.current && ref.current.click(), "aria-label": src ? "Change your photo" : "Add your photo" } : { className: "ph", style: { cursor: "inherit" } },
        src ? <img decoding="async" src={src} alt="" /> : <span className="add"><CameraPlusGlyph size={28} /><span>{edit ? "Add your photo" : "Your photo"}</span></span>,
        edit ? <input ref={ref} type="file" accept="image/*" hidden onChange={pick} /> : null)}
      <span className="vq" aria-hidden="true"><VipQr21 seed={(c.name || "") + (tag || "")} /></span>
      <div className="body">
        {edit ? <input className="ff-cardin nm" value={c.name || ""} placeholder="Your name" aria-label="Your name" maxLength={40} onChange={(e) => set && set({ name: e.target.value })} />
          : <b className="nm">{c.name || "Your name"}</b>}
        {row(Wine, "Favourite drinks", list(c.drinks))}
        {row(Heart, "Interests", list(c.interests))}
        {row(Spark, "Personality", list(c.vibes))}
        {row(Leaf, "Dietary needs", diet)}
      </div>
    </div>
  );
}


const VIP21_SAMPLE = { name: "Jamie", photo: "t17_p12", drinks: ["Espresso Martini", "Champagne", "Mezcal Paloma"], interests: ["Live music", "Travel"], diet: ["Vegetarian"], vibes: ["Loves a toast"], seat: "A booth" };


function VipHero21() {
  const { state, dispatch } = useStore();
  const joined = !!(state.vip21 || {}).guest;
  const X = window.__ffVipX || {};
  const Search = X.HireSearch;
  const Contact = lucideIcon("Contact");
  const IM = window.FF_IMG || {};
  /* Same hero as FF Team, FF Staff and FF Party: photograph, coin, heading, one button, search. */
  return (
    <section className="ff-hero18 ff-hero11 vip" aria-labelledby="ff-v21-h" id="ff-hero">
      <div className="ff-hero18-img">
        {IM.hero ? <img decoding="async" className="ff-hero18-photo" src={IM.hero} srcSet={IM.hero_sm ? `${IM.hero_sm} 900w, ${IM.hero} 1800w` : undefined} sizes="(min-width:900px) 760px, 100vw" alt="" decoding="async" /> : null}
        <div className="ff-hero18-fade" aria-hidden="true" />
        <span className="ff-hero18-shadow" aria-hidden="true" />
        <span className="ff-hero18-coin refl" aria-hidden="true"><SiteHeroCoin site="vip" /></span>
        <span className="ff-hero18-coin ff-hero17-coin"><SiteHeroCoin site="vip" /></span>
      </div>
      <div className="ff-hero18-in">
        <h1 id="ff-v21-h" className="ff-hero17-h ff-hero-h101">Welcome to FF VIP</h1>
        <p className="ff-hero-sub101">Your card. Your night.</p>
        <div className="ff-hero17-cta"><VipShine21 onClick={() => vipGo21(dispatch, "profile")}><Contact size={15} /> {joined ? "Open your VIP card" : "Join the guest list"}</VipShine21></div>
        {Search ? <div className="ff-hero17-ai"><Search placeholder="Search luxury experiences…" /></div> : null}
      </div>
    </section>
  );
}


/* After the four pillars: what FF VIP is for. */
function VipKnown21() {
  const { state, dispatch } = useStore();
  const v = state.vip21 || {};
  const done = vipCardDone21(v);
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-known" aria-labelledby="ff-v21-kh">
      <div className="ff-v21-split">
        <div className="ff-v21-cardwrap"><VipCard21 card={done ? v.card : VIP21_SAMPLE} tag={done ? (state.session && state.session.tag) : ""} sample={!done} /></div>
        <div>
          <h2 id="ff-v21-kh" className="ff-h1">Be known the moment you arrive.</h2>
          <p className="ff-v21-lead">Your VIP card tells every venue who you are, what you drink and how you like to be looked after. Book luxury experiences, group nights and the best tables, and earn FF Rewards for bringing people with you.</p>
          <div className="ff-v21-btns">
            <VipShine21 onClick={() => vipGo21(dispatch, "profile")}>{v.guest ? "Open your VIP card" : "Create your VIP card"}</VipShine21>
            <Btn onClick={() => vipGo21(dispatch, "network")}>Browse experiences</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}


/* The four pillars on the home page, in the same Discover panel the other sites use. */
function vipDx21() {
  const mk = (C) => ({ id: "", r: () => React.createElement(C, null) });
  const part = (id, label, C) => ({ id, label, r: () => React.createElement(C, null) });
  const I = lucideIcon;
  return [
    { k: "card", t: "Your VIP card", s: "Known the moment you arrive", img: "t17_p12", pool: ["p12", "p18", "p20", "p15", "p08"], icon: I("Contact"),
      h: "One card that tells every venue who you are.",
      p: ["Your favourite drinks, what you eat and cannot eat, and how you like to be looked after, all on one card.",
        "The staff know what you like before you sit down, so the first round is right and the table is ready.",
        "Add it to your wallet and show it at the door."],
      parts: [part("ff-v21-card", "Your VIP card", VipCardSect21)],
      jn: [
        { t: "Create your card", b: "Create your VIP card", go: "profile", x: "Choose your drinks, your dietary needs and your personality. It takes a couple of minutes." },
        { t: "Add it to your wallet", b: "Open my card", go: "profile", x: "Keep your card in Apple Wallet or Google Wallet and show it when you arrive." },
        { t: "Share it", b: "Share my card", go: "profile", x: "Send your card to the person booking your table, so everyone arrives known." },
      ] },
    { k: "experiences", t: "Our Experiences", s: "Luxury, found for you", img: "t17_p30", pool: ["p30", "p01", "v01", "p14", "vke02"], icon: I("Sparkles"),
      h: "The best experiences and hospitality.",
      p: ["Spas, racetracks, fine dining, rooftops and more, found and shown by FireFlair with a focus on luxury.",
        "Venues join through FF Staff, so every experience you see is one we have chosen."],
      parts: [part("ff-v21-exp", "Experiences", VipExpSect21), part("ff-v21-ven", "Venues", VipVenues21)],
      jn: [
        { t: "Browse experiences", b: "Browse", go: "network", x: "Twelve kinds of luxury experience, from spa days to track days." },
        { t: "Plan a VIP booking", b: "Plan a booking", go: "bookings", x: "Make your Event Card, choose an experience and add your VIP requests." },
        { t: "Run a venue?", b: "Join through FF Staff", go: "site:staff", x: "Venues and experience providers join FireFlair through FF Staff." },
      ] },
    { k: "booking", t: "Your Booking", s: "VIP and group bookings", img: "t17_p32", pool: ["p32", "aiMusic", "p24", "aiIntl", "p46"], icon: I("CalendarDays"),
      h: "Book it the VIP way.",
      p: ["Instead of an email and a phone number, the venue receives your VIP card with your drinks and dietary needs.",
        "With partnered venues you can pre-order drinks for the group, ask for champagne on arrival, the best tables and private places, and choose your favourite waiter or personal bartender."],
      parts: [part("ff-v21-book", "VIP bookings", VipBookSect21)],
      jn: [
        { t: "Plan a VIP booking", b: "Plan a booking", go: "bookings", x: "Make your Event Card, choose an experience and add your VIP requests." },
        { t: "Pre-order the drinks", b: "Start a booking", go: "bookings", x: "Choose from the venue's cocktail menu so the drinks are waiting." },
        { t: "Choose your people", b: "Start a booking", go: "bookings", x: "Ask for the waiter or the bartender you like." },
      ] },
    { k: "rewards", t: "Invitations and Rewards", s: "Bring people with you", img: "t17_p31", pool: ["p31", "vke04", "p11", "p35", "p27"], icon: I("Users"),
      h: "Host the night. Share FireFlair.",
      p: ["Hosting? Make an Event Card, then turn it into an invitation and send it on WhatsApp. Guests reply by creating their own VIP card, so you see who is coming and what each guest likes.",
        "Everyone you bring to FireFlair earns you FF Rewards. The points system opens later, and everyone you bring before then counts."],
      parts: [part("ff-v21-host", "Invitations", VipHost21), part("ff-v21-rew", "FF Rewards", VipRewardsSect21)],
      jn: [
        { t: "Share your event", b: "Create an Event Card", go: "bookings", x: "Make an Event Card, then turn it into an invitation and send it to your guests on WhatsApp." },
        { t: "Share your link", b: "Get my link", go: "profile", x: "Your own FF VIP link, ready to send." },
        { t: "See the guest list", b: "Join the guest list", go: "profile", x: "Create your card to join the launch party guest list." },
      ] },
  ];
}


function VipLaunch21() {
  const { state, dispatch } = useStore();
  const v = state.vip21 || {};
  const [box, setBox] = useState(null);
  const L = VIP21.party;
  const boxes = [
    ["Why a VIP card?", "So we know you", ["Every guest creates a VIP card to join the guest list. It tells our team who you are and what you like, so your first drink is already decided and your table is already ready.", "It is the first night run on FF VIP, and your card is your invitation."]],
    ["Who is invited?", "By invitation", ["Hospitality professionals, the people who work with them, and the guests who love a good night out. Bring someone: the more people you invite, the more FF Rewards you earn once points open."]],
    ["What happens next?", "After you sign up", ["You are on the guest list as soon as your card is saved. Your card goes in your wallet, and your invitation and details arrive there and by message ahead of the night."]],
    ["Where and when?", L.when + " · " + L.place, ["The FireFlair launch party takes place in Shoreditch, London, in early 2027. The date and the venue are announced to the guest list first."]],
  ];
  const cur = box === null ? null : boxes[box];
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-launch" aria-labelledby="ff-v21-lh">
      <style>{VIP21_PROMO_A + VIP21_PROMO_B}</style>
      <div className="ff-cp20 big">
        <div className="ff-cp20-in">
          <div>
            <div className="ff-cp20-eye"><Coin size={40} tier="gold" /><span>FF VIP launch party</span></div>
            <h2 id="ff-v21-lh">Join the guest list.</h2>
            <span className="ff-cp20-date">{L.when} {"·"} {L.place}</span>
            <p>The FireFlair launch party is by invitation, and your VIP card is how you get one. Create your card, and you are on the list.</p>
            {v.guest ? <div className="ff-v21-guest" role="status">You are on the guest list</div> : null}
            <div className="ff-cp20-btns">
              <VipShine21 onClick={() => vipGo21(dispatch, "profile")}>{v.guest ? "Open your VIP card" : vipCardDone21(v) ? "Join the guest list" : "Create your VIP card"}</VipShine21>
            </div>
          </div>
          <div>
            <div className="ff-cp20-boxes">{boxes.map((b, i) => <button key={b[0]} type="button" className="ff-cp20-box" onClick={() => setBox(i)} aria-haspopup="dialog"><b>{b[0]}</b><span>{b[1]}</span></button>)}</div>
            <div className="ff-cp20-url">FFVIP.uk</div>
          </div>
        </div>
      </div>
      <Sheet open={box !== null} onClose={() => setBox(null)} title={cur ? cur[0] : ""} center>
        {cur ? <div className="ff-cp20r">{cur[2].map((p, i) => <p key={i}>{p}</p>)}</div> : null}
      </Sheet>
    </section>
  );
}


function VipHow21() {
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-how" aria-labelledby="ff-v21-hh">
      <h2 id="ff-v21-hh" className="ff-h1">How FF VIP works</h2>
      <p className="ff-v21-lead">One card, carried everywhere you go out. Venues stop asking and start looking after you.</p>
      <ol className="ff-v21-steps">{VIP21_STEPS.map((s, i) => <li key={s[0]}><span className="n">{i + 1}</span><span><b>{s[0]}</b><small>{s[1]}</small></span></li>)}</ol>
    </section>
  );
}


function VipCardSect21() {
  const { state, dispatch } = useStore();
  const v = state.vip21 || {};
  const Check = vipIcon21("Check");
  const done = vipCardDone21(v);
  const pts = ["Your favourite drinks, so the first round is right.", "What you eat and what you cannot, so the kitchen knows before you sit down.", "Your personality, so the staff know whether you want a toast or a quiet table.", "Added to your wallet, and shown at the door."];
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-card" aria-labelledby="ff-v21-ch">
      <div className="ff-v21-split">
        <div className="ff-v21-cardwrap"><VipCard21 card={done ? v.card : VIP21_SAMPLE} tag={done ? (state.session && state.session.tag) : ""} sample={!done} /></div>
        <div>
          <h2 id="ff-v21-ch" className="ff-h1">Your VIP card</h2>
          <p className="ff-v21-lead">At whatever event you go to, the staff know who you are and what you like. That is the point of FF VIP.</p>
          <ul className="ff-v21-list">{pts.map(p => <li key={p}><Check size={18} strokeWidth={2.4} /><span>{p}</span></li>)}</ul>
          <div className="ff-v21-btns"><VipShine21 onClick={() => vipGo21(dispatch, "profile")}>{done ? "Edit your VIP card" : "Create your VIP card"}</VipShine21></div>
        </div>
      </div>
    </section>
  );
}


function VipBookSect21() {
  const { dispatch } = useStore();
  const Check = vipIcon21("Check");
  const perks = ["Your VIP card sent to the venue, not just an email address and a phone number.", "Pre-order drinks for the whole group from the venue\u2019s cocktail menu.", "Champagne on arrival.", "Ask for the best tables, or a private place.", "Choose your favourite staff: your waiter, or your personal bartender for the night."];
  return React.createElement("section", { className: "ff-sect ff-v21-sect", id: "ff-v21-vipbook", "aria-labelledby": "ff-v21-bh" }, React.createElement("div", { className: "ff-v21-dark" }, React.createElement("h2", { id: "ff-v21-bh", className: "ff-h1", style: { margin: "0 0 6px" } }, "What makes it a VIP booking"), React.createElement("p", null, "Book a table and the venue usually gets a name, an email address and a phone number. Book through FF VIP and they get you."), React.createElement("ul", { className: "ff-v21-list", style: { margin: "12px 0" } }, perks.map((p) => React.createElement("li", { key: p, style: { color: "#F4F2EC" } }, React.createElement(Check, { size: 18, strokeWidth: 2.4, style: { color: "#E7CB7A" } }), React.createElement("span", null, p)))), React.createElement("p", null, "Group bookings work the same way: one booking, the whole table\u2019s preferences, and the drinks waiting."), React.createElement("div", { className: "ff-v21-btns" }, React.createElement(VipShine21, { onClick: () => vipGo21(dispatch, "bookings") }, "Plan a VIP booking"))));
}


function VipExpSect21() {
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-exp" aria-labelledby="ff-v21-eh">
      <h2 id="ff-v21-eh" className="ff-h1">The best experiences and hospitality</h2>
      <p className="ff-v21-lead">Luxury, chosen for you. Spas, racetracks, tables and rooms that are worth the trip, found and shown by FireFlair.</p>
      <VipExpList21 groups={VIP21_GROUPS()} />
    </section>
  );
}


function VipHost21() {
  const { dispatch } = useStore();
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-host" aria-labelledby="ff-v21-oh">
      <div className="ff-v21-split">
        <div>
          <h2 id="ff-v21-oh" className="ff-h1">Hosting? Share your event.</h2>
          <p className="ff-v21-lead">Create an Event Card, then turn it into an invitation and send it on WhatsApp. Your guests reply by creating their own VIP card, so you know who is coming and what to have ready for them.</p>
          <div className="ff-v21-btns"><VipShine21 onClick={() => vipGo21(dispatch, "bookings")}>Create an Event Card</VipShine21></div>
        </div>
        <VipPartyLink21 />
      </div>
    </section>
  );
}


function VipPartyLink21() {
  return (
    <div className="ff-v21-dark" style={{ maxWidth: 460 }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>From invitation to the door</h3>
      <ul className="ff-v21-list" style={{ color: "#F4F2EC" }}>
        {["You invite", "They create a VIP card", "You see the guest list and what each guest likes", "Everyone arrives known"].map(t => <li key={t} style={{ color: "#F4F2EC" }}><span style={{ color: "#E7CB7A", fontWeight: 700 }}>{"•"}</span><span>{t}</span></li>)}
      </ul>
    </div>
  );
}


function VipRewardsSect21() {
  const { state, dispatch } = useStore();
  const link = VIP21.domain + "/" + VIP21.slug(state);
  const msg = "Create your VIP card on FireFlair: https://" + link;
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-rewards" aria-labelledby="ff-v21-rh">
      <div className="ff-v21-dark">
        <div className="ff-cp20-eye" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#D9DCE2" }}><Coin size={34} tier="gold" /><span>FF Rewards</span></div>
        <h2 id="ff-v21-rh" className="ff-h1" style={{ margin: "8px 0 6px" }}>Share FireFlair. Earn FF Rewards.</h2>
        <p>Every person you bring to FireFlair earns you reward points. The more you share, the more you earn.</p>
        <div className="ff-v21-link"><code>{link}</code>
          <Btn onClick={() => vipCopy21(dispatch, "https://" + link)}>Copy link</Btn>
          <Btn onClick={() => vipShare21(msg)}>Share on WhatsApp</Btn></div>
        <p style={{ fontSize: 13.5, opacity: .85 }}>The points system opens later. Everyone you bring before then counts.</p>
      </div>
    </section>
  );
}


function VipVenues21() {
  const goSite = useGoSite();
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-venues" aria-labelledby="ff-v21-vh">
      <h2 id="ff-v21-vh" className="ff-h1">Run a venue or an experience?</h2>
      <p className="ff-v21-lead">Venues join through FF Staff. Spas, racetracks, restaurants and every other kind of luxury experience can be found and booked by guests who arrive known.</p>
      <div className="ff-v21-btns"><Btn onClick={() => goSite("staff")}>Join through FF Staff</Btn></div>
    </section>
  );
}


function VipFaq21() {
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-faq" aria-labelledby="ff-v21-fh">
      <h2 id="ff-v21-fh" className="ff-h1">Questions</h2>
      <div className="ff-v21-faq">{VIP21_FAQ.map(q => <details key={q[0]}><summary>{q[0]}</summary><p>{q[1]}</p></details>)}</div>
    </section>
  );
}


function VipHome21() {
  const X = window.__ffVipX || {};
  const Hub = X.DiscoverHub11;
  return (
    <div className="ff-home ff-home11 ff-v21">
      <style>{VIP21_CSS}</style>
      <div className="ff-home17">
        <VipHero21 />
        {vipJoin21([
          Hub ? <Hub key="discover" cats={vipDx21()} kind="vip" /> : null,
          <VipLaunch21 key="launch" />,
          <VipKnown21 key="known" />,
          <VipHow21 key="how" />,
          <VipFaq21 key="faq" />,
        ].filter(Boolean))}
      </div>
    </div>
  );
}


function VipExperiences21() {
  const { state } = useStore();
  if (state.vip21v) return <VipProfile21 />;
  return (
    <div className="ff-home ff-home11 ff-v21">
      <style>{VIP21_CSS}</style>
      <div className="ff-home17">
        <section className="ff-sect ff-v21-sect" aria-labelledby="ff-v21-xh">
          <h1 id="ff-v21-xh" className="ff-h1" style={{ fontSize: "clamp(28px,7vw,42px)" }}>Experiences</h1>
          <p className="ff-v21-lead">We find and show the best experiences and hospitality. Luxury, chosen for you, from a spa day to a private table.</p>
        </section>
        <VipMap21 />
        {VIP21_GROUPS().map(g => (
          <section key={g.t} className="ff-sect ff-v21-sect" aria-label={g.t}>
            <h2 className="ff-h1">{g.t}</h2>
            <VipExpList21 groups={[{ t: "", list: g.list }]} />
          </section>))}
        <VipPeople21 />
        <VipVenues21 />
      </div>
    </div>
  );
}


/* The VIP booking: three things and a Confirm, the same as the other booking screens. */
function VipBook21() {
  const { state, dispatch } = useStore();
  const v = state.vip21 || {};
  const done = vipCardDone21(v);
  const events = v.events || [];
  const blank = () => ({ id: uid("evt"), title: "", kind: "", iso: "", start: "", venue: "", guests: "", details: "" });
  const [ev, setEv] = useState(blank);
  const [f, setF] = useState(() => ({ exp: v.pick || "", drinks: {}, champagne: false, table: false, priv: false, waiter: "", bartender: "" }));
  const [op, setOp] = useState({});
  const [sent, setSent] = useState(null);
  const [invOpen, setInvOpen] = useState(null);
  const setOpK = (k, val) => setOp(o => ({ ...o, [k]: val }));
  const set = (p) => setF(x => ({ ...x, ...p }));
  const Cal = vipIcon21("CalendarDays"), Spark = vipIcon21("Sparkles"), Crown = vipIcon21("Crown"), Check = vipIcon21("Check"), Send = vipIcon21("Send"), Pencil = vipIcon21("Pencil");
  const exp = VIP21_EXP.find(x => x.k === f.exp);
  const total = Object.values(f.drinks).reduce((a, b) => a + b, 0);
  const bump = (d, n) => set({ drinks: { ...f.drinks, [d]: Math.max(0, (f.drinks[d] || 0) + n) } });
  const evDone = !!(ev.iso && String(ev.venue || "").trim());
  const reqBits = [f.champagne && "Champagne", f.table && "Best table", f.priv && "Private place", total ? total + " drinks" : "", f.waiter && "Waiter", f.bartender && "Bartender"].filter(Boolean);
  const upsert = (data) => { const list = events.some(e => e.id === ev.id) ? events.map(e => e.id === ev.id ? { ...e, ...data } : e) : [{ id: ev.id, ...data }, ...events]; vipPatch21(dispatch, state, { events: list, pick: "" }); };
  const saveEvent = () => {
    if (!evDone) { dispatch({ type: "TOAST", toast: "Add the date and location" }); return false; }
    const ci = cleanIso11(ev.iso);
    if (ci.past) { setEv(d => ({ ...d, iso: ci.iso })); dispatch({ type: "TOAST", toast: "That date has already passed. Choose today or a later date" }); return false; }
    upsert(eventData11({ ...ev, iso: ci.iso }));
    dispatch({ type: "TOAST", toast: "Event Card saved" });
    setOpK("event", false);
    return true;
  };
  const confirm = () => {
    if (!done) { dispatch({ type: "TOAST", toast: "Create your VIP card first, so the venue receives it" }); return; }
    if (!evDone) { setOpK("event", true); focusSec("ff-bs-event"); dispatch({ type: "TOAST", toast: "Add the date and location" }); return; }
    if (!f.exp) { setOpK("exp", true); focusSec("ff-bs-exp"); dispatch({ type: "TOAST", toast: "Choose the kind of experience" }); return; }
    const ci = cleanIso11(ev.iso);
    if (ci.past) { setOpK("event", true); dispatch({ type: "TOAST", toast: "That date has already passed. Choose today or a later date" }); return; }
    const ref = vipRef21("VIP");
    const drinks = Object.entries(f.drinks).filter(x => x[1] > 0).map(x => x[1] + " x " + x[0]).join(", ");
    const bits = ["Experience: " + exp.t, ev.kind && "Occasion: " + ev.kind, ev.guests && "Group: " + ev.guests, drinks && "Drinks: " + drinks, f.champagne && "Champagne on arrival", f.table && "Best table", f.priv && "Private place", f.waiter && "Waiter: " + f.waiter, f.bartender && "Bartender: " + f.bartender, ev.details, "VIP card: " + (v.card.name || "")].filter(Boolean);
    const cur = fdOf(state);
    const rec = {
      id: uid("lsr"), ref, key: ref, kind: "vip_booking", siteKey: "vip", locationId: null, locationText: ev.venue.trim() || "Not stated",
      roles: [], eventDate: ci.iso || null, dateUndecided: !ci.iso, tz: "Europe/London",
      contact: { name: v.card.name || "", email: "", phone: "", whatsappOk: true },
      headcount: String(ev.guests || ""), brief: bits.join(" | "), companyId: null, companyName: "",
      createdAt: new Date().toISOString(), status: "new", assignee: "", adminNote: "", eventId: ev.id,
      sourcePath: "", sourceSite: "vip", notif: { admin: "simulated", ack: "simulated message", failed: false }, bookingId: null,
    };
    fdSet(state, dispatch, { requests: [rec, ...cur.requests], log: [{ at: rec.createdAt, by: "visitor", what: "vip_booking " + ref, site: "vip" }, ...cur.log].slice(0, 200) });
    const data = { ...eventData11({ ...ev, iso: ci.iso }), exp: exp.t, ref };
    const list = events.some(e => e.id === ev.id) ? events.map(e => e.id === ev.id ? { ...e, ...data } : e) : [{ id: ev.id, ...data }, ...events];
    vipPatch21(dispatch, state, { events: list, pick: "", bookings: [{ ref, exp: exp.t, group: ev.guests, date: ci.iso, at: Date.now() }, ...(v.bookings || [])] });
    setSent(ref); setOp({});
    focusSec("ff-bs-confirm");
  };
  const reset = () => { setSent(null); setEv(blank()); setF({ exp: "", drinks: {}, champagne: false, table: false, priv: false, waiter: "", bartender: "" }); setOp({}); window.scrollTo(0, 0); };
  const editEvent = (e) => { setEv({ id: e.id, title: e.title || "", kind: e.kind || "", iso: e.iso || "", start: e.start || "", venue: e.venue || "", guests: e.guests || "", details: e.details || "" }); setSent(null); setOpK("event", true); focusSec("ff-bs-event"); };
  const openInvite = (e) => setInvOpen({ evId: e.id, title: eventTitle(e), date: e.iso ? longDay(e.iso) : (e.date || ""), venue: e.venue || "" });
  const host = (v.card && v.card.name) || "";
  const sw = (key, t, s) => <button type="button" className="ff-v21-sw" aria-pressed={!!f[key]} onClick={() => set({ [key]: !f[key] })}><span><b>{t}</b><small>{s}</small></span><i aria-hidden="true" /></button>;
  const when = ev.iso ? new Date(ev.iso + "T12:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "";
  const secEvent = (
    <div className="ff-bsec s1" id="ff-bs-event" key="event">
      {op.event ? (<>
        <SecHead n={1} title="Event Card" onToggle={() => setOpK("event", false)} />
        <div className="ff-evwrap"><EventCard11 ev={ev} edit onPatch={(x) => setEv(d => ({ ...d, ...x }))} /></div>
        <div className="ff-v21-btns" style={{ marginTop: 12, justifyContent: "center" }}><Btn variant="primary" onClick={saveEvent}><Check size={14} /> Save Event Card</Btn></div>
      </>) : (
        <BigBtn n={1} icon={Cal} title="Event Card" done={evDone}
          hint={evDone ? [when, ev.start, ev.venue].filter(Boolean).join(" · ") : "Date, place and guests"}
          onClick={() => { setOpK("event", true); focusSec("ff-bs-event"); }} />
      )}
    </div>
  );
  const secExp = (
    <div className="ff-bsec s2" id="ff-bs-exp" key="exp">
      {op.exp ? (<>
        <SecHead n={2} title="Experience" onToggle={() => setOpK("exp", false)} />
        <HScroll label="Experiences">{VIP21_EXP.map(e => (
          <button key={e.k} type="button" className="ff-v21-xsel" aria-pressed={f.exp === e.k} onClick={() => { set({ exp: e.k }); setOpK("exp", false); }}>
            <span className="pic">{vipImg21(e.img) ? <img decoding="async" src={vipImg21(e.img)} alt="" /> : null}</span><b>{e.t}</b><small>{e.s}</small>
          </button>))}</HScroll>
      </>) : (
        <BigBtn n={2} icon={Spark} title="Experience" done={!!f.exp} hint={exp ? exp.t : "Choose what you would like to do"}
          onClick={() => { setOpK("exp", true); focusSec("ff-bs-exp"); }} />
      )}
    </div>
  );
  const secReq = (
    <div className="ff-bsec s3" id="ff-bs-req" key="req">
      {op.req ? (<>
        <SecHead n={3} title="VIP requests" onToggle={() => setOpK("req", false)} />
        <div className="ff-v21-form" style={{ marginTop: 8 }}>
          <div>
            <h3>Pre-order drinks{total ? ` · ${total}` : ""}</h3>
            <div className="ff-v21-menu" style={{ marginTop: 8 }}>{VIP21_MENU.map(d => <div key={d}><span>{d}</span><span className="ff-v21-step"><button type="button" aria-label={`Fewer ${d}`} onClick={() => bump(d, -1)}>{"−"}</button><b>{f.drinks[d] || 0}</b><button type="button" aria-label={`More ${d}`} onClick={() => bump(d, 1)}>+</button></span></div>)}</div>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {sw("champagne", "Champagne on arrival", "Poured as you sit down")}
            {sw("table", "The best table", "Ask for the best table in the house")}
            {sw("priv", "A private place", "A private room or a screened corner")}
          </div>
          <div className="ff-v21-row">
            <label><span className="ff-v21-k">Your waiter</span><input className="ff-v21-in" value={f.waiter} onChange={(e) => set({ waiter: e.target.value })} placeholder="Name or FF Tag" aria-label="Your waiter" /></label>
            <label><span className="ff-v21-k">Your personal bartender</span><input className="ff-v21-in" value={f.bartender} onChange={(e) => set({ bartender: e.target.value })} placeholder="Name or FF Tag" aria-label="Your personal bartender" /></label>
          </div>
        </div>
      </>) : (
        <BigBtn n={3} icon={Crown} title="VIP requests" done={reqBits.length > 0} hint={reqBits.length ? reqBits.join(" · ") : "Drinks, champagne, tables, your people"}
          onClick={() => { setOpK("req", true); focusSec("ff-bs-req"); }} />
      )}
    </div>
  );
  const arrow = (i) => <div key={"j" + i} className={`ff-barrow j${i}`} aria-hidden="true">{React.createElement(vipIcon21("ChevronDown"), { size: 20, strokeWidth: 2.4 })}</div>;
  return (
    <div className="ff-home ff-home11 ff-v21">
      <style>{VIP21_CSS}</style>
      <div className="ff-home17">
        <section className="ff-bbox" aria-label="Your VIP booking" style={{ marginTop: 14 }}>
          <header className="ff-bbox-h"><div><span className="ff-ev11-eye">FF VIP</span><h2>{sent ? "Booking sent" : "Your VIP booking"}</h2></div></header>
          {!done ? <div className="ff-v21-guest" role="status" style={{ margin: "0 0 12px", color: "inherit", background: "rgba(165,128,47,.14)", borderColor: "rgba(165,128,47,.6)" }}>Create your VIP card first, so the venue receives it. <button type="button" className="ff-v21-link" onClick={() => vipGo21(dispatch, "profile")}>Create your VIP card</button></div> : null}
          {secEvent}{arrow(1)}{secExp}{arrow(2)}{secReq}{arrow(3)}
          <div className="ff-bsec s4 coin" id="ff-bs-confirm">
            {sent ? (
              <div className="ff-v21-done" role="status"><b>VIP booking request sent. Reference {sent}</b>
                <p style={{ margin: "4px 0 12px" }}>The venue receives your VIP card with the request. FireFlair will confirm it with you.</p>
                <div style={{ maxWidth: 260, margin: "0 auto 14px" }}><VipCard21 card={v.card} tag={state.session && state.session.tag} /></div>
                <div className="ff-v21-btns" style={{ justifyContent: "center" }}>
                  <VipShine21 onClick={() => { const e = (v.events || []).find(x => x.id === ev.id); if (e) openInvite(e); }}>Share as an invitation</VipShine21>
                  <Btn onClick={reset}>Plan another</Btn></div></div>
            ) : <ConfirmSpin17 lines={["Review", "&", "Confirm"]} label="Review and confirm your VIP booking" onClick={confirm} />}
          </div>
        </section>
        {events.length > 0 ? (
          <section className="ff-sect ff-v21-sect" aria-labelledby="ff-v21-evh">
            <h2 id="ff-v21-evh" className="ff-h1">Your events</h2>
            <HScroll label="Your events">{events.map(e => (
              <div key={e.id} className="ff-pev17-c" style={{ width: 300, flex: "none" }}>
                <EventCard11 ev={e} />
                <div className="ff-v21-btns" style={{ marginTop: 8, justifyContent: "center" }}>
                  <button type="button" className="ff-pev17-again" onClick={() => openInvite(e)}><Send size={14} /> Share invitation</button>
                  <button type="button" className="ff-pev17-again" onClick={() => editEvent(e)}><Pencil size={14} /> Edit</button>
                </div>
              </div>))}</HScroll>
            {(state.inv17 || []).length > 0 ? <div style={{ marginTop: 16 }}><h3 className="ff-v21-gh">Invitations</h3>
              <HScroll label="Invitations">{(state.inv17 || []).map(iv => (
                <div key={iv.id} className="ff-inv17-it" style={{ width: 300, flex: "none" }}>
                  <InviteCard17 iv={iv} host={host} />
                  <div className="acts"><a className="ff-pev17-again" target="_blank" rel="noopener noreferrer" href={inviteShare17(iv, host)}><Send size={14} /> Share</a></div>
                </div>))}</HScroll></div> : null}
          </section>) : null}
      </div>
      {invOpen ? <InviteBuilder17 init={invOpen} events={events} host={host} onClose={() => setInvOpen(null)} /> : null}
    </div>
  );
}


function VipChips21({ list, value, onChange, custom }) {
  const [add, setAdd] = useState("");
  const all = Array.from(new Set([...list, ...(value || [])]));
  const toggle = (x) => onChange((value || []).includes(x) ? value.filter(y => y !== x) : [...(value || []), x]);
  return (
    <div>
      <div className="ff-v21-chips">{all.map(x => <button key={x} type="button" className="ff-v21-chip" aria-pressed={(value || []).includes(x)} onClick={() => toggle(x)}>{x}</button>)}</div>
      {custom && <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input className="ff-v21-in" value={add} onChange={(e) => setAdd(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const t = add.trim(); if (t) { toggle(t); setAdd(""); } } }} placeholder={custom} aria-label={custom} />
        <Btn onClick={() => { const t = add.trim(); if (t) { toggle(t); setAdd(""); } }}>Add</Btn>
      </div>}
    </div>
  );
}


/* Experiences: a picture, a dropdown, and a way to plan it. */
function VipExpList21({ groups }) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState({});
  const Chev = vipIcon21("ChevronDown");
  const plan = (e) => { vipPatch21(dispatch, state, { pick: e.k }); vipGo21(dispatch, "bookings"); };
  const item = (e) => {
    const on = !!open[e.k];
    return (
      <article key={e.k} className={`ff-v21-xp${on ? " on" : ""}`} id={"ff-v21-x-" + e.k}>
        <button type="button" className="h" aria-expanded={on} onClick={() => setOpen(o => ({ ...o, [e.k]: !o[e.k] }))}>
          <span className="pic">{vipImg21(e.img) ? <img decoding="async" src={vipImg21(e.img)} alt="" /> : null}</span>
          <span className="tx"><b>{e.t}</b><small>{e.s}</small></span>
          <Chev size={18} className="cv" />
        </button>
        {on ? <div className="b"><p>{e.d}</p><p className="f">{e.f}</p>
          <div className="ff-v21-btns" style={{ marginTop: 10 }}><VipShine21 onClick={() => plan(e)}>Plan this</VipShine21></div></div> : null}
      </article>
    );
  };
  return <>{groups.map(g => (
    <div key={g.t} className="ff-v21-xg">
      {g.t ? <h3 className="ff-v21-gh">{g.t}</h3> : null}
      <div className="ff-v21-xl">{g.list.map(item)}</div>
    </div>))}</>;
}


const VIP21_GROUPS = () => [
  { t: "Eat and drink", list: VIP21_EXP.filter(e => ["dine", "roof", "priv", "tea", "wine"].includes(e.k)) },
  { t: "Relax and play", list: VIP21_EXP.filter(e => ["spa", "track", "water", "estate"].includes(e.k)) },
  { t: "Stay and go out", list: VIP21_EXP.filter(e => ["hotel", "show", "club"].includes(e.k)) },
];


/* Sample VIPs for the prototype: first names only, so guests can see who else is on FF VIP. The real directory comes from saved VIP cards. */
const VIP21_INTERESTS = ["Live music", "Travel", "Fine dining", "Wine", "Art", "Football", "Motorsport", "Fashion", "Theatre", "Cooking", "Fitness", "Gardening"];


const VIP21_PEOPLE = [
  { id: "vp_amara", name: "Amara", photo: "jr_whyteam", area: "Hackney", ll: [51.545, -0.055], drinks: ["Espresso Martini", "Champagne"], interests: ["Live music", "Travel"], vibes: ["Life of the party"], diet: ["Vegetarian"], line: "Birthdays, rooftops and long lunches." },
  { id: "vp_theo", name: "Theo", photo: "t17_vke07", area: "Chelsea", ll: [51.487, -0.168], drinks: ["Old Fashioned", "Negroni"], interests: ["Motorsport", "Wine"], vibes: ["Relaxed and quiet"], diet: [], line: "A good table and a better bartender." },
  { id: "vp_priya", name: "Priya", photo: "reward_photoshoot", area: "Islington", ll: [51.536, -0.103], drinks: ["Margarita", "Prosecco"], interests: ["Theatre", "Cooking"], vibes: ["Loves a toast"], diet: ["Vegan"], line: "Group dinners are my thing." },
  { id: "vp_marcus", name: "Marcus", photo: "jr_profile", area: "Brixton", ll: [51.462, -0.115], drinks: ["Rum Punch", "Champagne"], interests: ["Football", "Fashion"], vibes: ["Life of the party"], diet: [], line: "Always the first one there." },
  { id: "vp_elena", name: "Elena", photo: "jr_cardsteam", area: "Notting Hill", ll: [51.509, -0.2], drinks: ["Gin and Tonic", "White Wine"], interests: ["Art", "Gardening"], vibes: ["Relaxed and quiet"], diet: ["Gluten free"], line: "Quiet corners and good wine." },
  { id: "vp_sofia", name: "Sofia", photo: "t17_p23", area: "Greenwich", ll: [51.482, -0.004], drinks: ["Aperol Spritz", "Mezcal Paloma"], interests: ["Travel", "Fitness"], vibes: ["Always on time"], diet: ["Pescatarian"], line: "Spa days and sunset boats." },
  { id: "vp_kit", name: "Kit", photo: "t17_vke09", area: "Richmond", ll: [51.461, -0.303], drinks: ["Whisky Sour", "Negroni"], interests: ["Fine dining", "Wine"], vibes: ["Loves a toast"], diet: [], line: "Tasting menus, no rush." },
];


const vipPerson21 = (id) => VIP21_PEOPLE.find(p => p.id === id);


const vipPhoto21 = (p) => (p && (p.photo && String(p.photo).indexOf("data:") === 0 ? p.photo : vipImg21(p && p.photo))) || "";


/* Other VIPs. */
function VipPeople21() {
  const { dispatch } = useStore();
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-people" aria-labelledby="ff-v21-ph">
      <h2 id="ff-v21-ph" className="ff-h1">VIPs</h2>
      <p className="ff-v21-lead">The people on FF VIP, and what they like.</p>
      <HScroll label="VIPs">{VIP21_PEOPLE.map(p => (
        <button key={p.id} type="button" className="ff-v21-pc" aria-label={`Open ${p.name}'s VIP card`} onClick={() => { dispatch({ type: "V11_SET", patch: { vip21v: p.id } }); window.scrollTo(0, 0); }}>
          <VipCard21 card={p} mini />
        </button>))}</HScroll>
    </section>
  );
}


function VipProfile21() {
  const { state, dispatch } = useStore();
  const p = vipPerson21(state.vip21v);
  if (!p) return null;
  const back = () => { dispatch({ type: "V11_SET", patch: { vip21v: null } }); window.scrollTo(0, 0); };
  const chips = (a) => <div className="ff-v21-chips">{(a || []).map(x => <span key={x} className="ff-v21-chip" aria-pressed="false">{x}</span>)}</div>;
  const sec = (Icon, title, body) => body ? <section style={{ marginTop: 22 }}><SectionHead icon={<Icon size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={title} />{body}</section> : null;
  const W = vipIcon21("Wine"), H = vipIcon21("Heart"), S = vipIcon21("Sparkles"), L = vipIcon21("Leaf");
  return (
    <div className="ff-home ff-home11 ff-v21">
      <style>{VIP21_CSS}</style>
      <div className="ff-host17">
        <button type="button" className="ff-fd-back" onClick={back}>{"←"} Back</button>
        <div className="ff-eyebrow">FF VIP · {p.area}</div>
        <PublicHero media={[{ id: p.id, src: vipPhoto21(p), name: p.name }].filter(m => m.src)} card={<VipCard21 card={p} />} below={<>
          <p className="ff-v21-lead" style={{ margin: "14px 0 0" }}>{p.line}</p>
          {sec(W, "Favourite drinks", chips(p.drinks))}
          {sec(S, "Personality", chips(p.vibes))}
          {sec(H, "Interests", chips(p.interests))}
          {sec(L, "Dietary needs", (p.diet || []).length ? chips(p.diet) : <p className="ff-body ff-muted" style={{ margin: 0 }}>Nothing shared.</p>)}
        </>} />
      </div>
    </div>
  );
}


/* The map: experiences and other VIPs, on the same UK map as the other sites. */
function VipMap21() {
  const { dispatch } = useStore();
  const boxRef = useRef(null), mapRef = useRef(null), layerRef = useRef(null);
  const [show, setShow] = useState({ vips: true, venues: true });
  const [sel, setSel] = useState(null);
  const [ready, setReady] = useState(false);
  const fallback = !window.L || !ukGeo11();
  const pins = useMemo(() => [
    ...VIP21_EXP.map(e => ({ kind: "venue", id: e.k, name: e.t, area: e.area, ll: e.ll, e })),
    ...VIP21_PEOPLE.map(p => ({ kind: "vip", id: p.id, name: p.name, area: p.area, ll: p.ll, p })),
  ], []);
  useEffect(() => {
    if (fallback || !boxRef.current) return;
    const L = window.L, G = ukGeo11();
    let map;
    try {
      map = L.map(boxRef.current, { zoomControl: false, attributionControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomSnap: 0.25, zoomDelta: 1, minZoom: 5, maxZoom: 13, preferCanvas: true });
      mapRef.current = map;
      const cv = L.canvas({ padding: 0.4 });
      const area = (sets, style) => sets && sets.length ? L.polygon(sets.map(p => p.map(decRing11)), { renderer: cv, interactive: false, ...style }) : null;
      const line = (sets, style) => sets && sets.length ? L.polyline(sets.map(decRing11), { renderer: cv, interactive: false, ...style }) : null;
      [
        area(G.world, { color: "#6E9A5A", opacity: 0.55, weight: 0.7, fillColor: "#C9DDB0", fillOpacity: 1 }),
        area(G.ie, { color: "#5E8C4A", opacity: 0.7, weight: 1, fillColor: "#B9D69B", fillOpacity: 1 }),
        area(G.gb, { color: "#4E7F3C", opacity: 0.9, weight: 1.3, fillColor: "#9FCB7A", fillOpacity: 1 }),
        area(G.lakes, { stroke: false, fillColor: "#8FC3E6", fillOpacity: 1 }),
        line(G.rivers, { color: "#4F9AD3", opacity: 0.8, weight: 1 }),
        area(G.ldnu, { color: "#3F6B33", opacity: 0.6, weight: 1.2, fillColor: "#86B862", fillOpacity: 0.7 }),
      ].forEach(l => l && l.addTo(map));
      const thSm = G.thames && G.thames.map(r => smooth11(decRing11(r), false, 2));
      if (thSm) L.polyline(thSm, { renderer: cv, interactive: false, color: "#2F7FC1", opacity: 0.95, weight: 4, lineJoin: "round", lineCap: "round" }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      map.fitBounds(L.latLngBounds(pins.map(p => p.ll)), { padding: [22, 22] });
      setReady(true);
    } catch (e) { /* the list below still works without the map */ }
    return () => { try { if (map) map.remove(); } catch (e) { /* closed */ } mapRef.current = null; layerRef.current = null; };
  }, []);
  useEffect(() => {
    const L = window.L, g = layerRef.current;
    if (!ready || !g) return;
    g.clearLayers();
    pins.filter(p => (p.kind === "vip" ? show.vips : show.venues)).forEach(p => {
      const html = p.kind === "vip" ? `<span class="v">${String(p.name).charAt(0)}</span>` : `<span class="x">${"◆"}</span>`;
      L.marker(p.ll, { keyboard: false, icon: L.divIcon({ className: "ff-v21-pin", html, iconSize: [30, 30], iconAnchor: [15, 15] }) })
        .on("click", () => setSel(p)).addTo(g);
    });
  }, [ready, show]);
  const zoom = (d) => { const m = mapRef.current; if (m) m.setZoom(m.getZoom() + d); };
  const fit = () => { const m = mapRef.current; if (m) m.fitBounds(window.L.latLngBounds(pins.map(p => p.ll)), { padding: [22, 22] }); };
  const tog = (k, label) => <button type="button" className="ff-v21-chip" aria-pressed={show[k]} onClick={() => setShow(s => ({ ...s, [k]: !s[k] }))}>{label}</button>;
  return (
    <section className="ff-sect ff-v21-sect" id="ff-v21-map" aria-labelledby="ff-v21-mph">
      <h2 id="ff-v21-mph" className="ff-h1">On the map</h2>
      <p className="ff-v21-lead">Experiences and VIPs near you.</p>
      <div className="ff-v21-chips" style={{ marginBottom: 10 }}>{tog("venues", "Experiences")}{tog("vips", "VIPs")}</div>
      {fallback ? null : (
        <div className="ff-v21-map">
          <div ref={boxRef} className="box" role="application" aria-label="Map of experiences and VIPs" />
          <div className="zm"><button type="button" aria-label="Zoom in" onClick={() => zoom(1)}>+</button><button type="button" aria-label="Zoom out" onClick={() => zoom(-1)}>{"−"}</button><button type="button" aria-label="Show everything" onClick={fit}>{"◎"}</button></div>
        </div>)}
      {sel ? (
        <div className="ff-v21-sel" role="status">
          {sel.kind === "vip" ? (<>
            <span className="pic">{vipPhoto21(sel.p) ? <img decoding="async" src={vipPhoto21(sel.p)} alt="" /> : null}</span>
            <span className="tx"><b>{sel.p.name}</b><small>VIP · {sel.area}</small></span>
            <Btn onClick={() => { dispatch({ type: "V11_SET", patch: { vip21v: sel.p.id } }); window.scrollTo(0, 0); }}>View card</Btn>
          </>) : (<>
            <span className="pic">{vipImg21(sel.e.img) ? <img decoding="async" src={vipImg21(sel.e.img)} alt="" /> : null}</span>
            <span className="tx"><b>{sel.e.t}</b><small>Example · {sel.area}</small></span>
            <Btn onClick={() => { const el = document.getElementById("ff-v21-x-" + sel.e.k); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }}>See it</Btn>
          </>)}
        </div>) : null}
    </section>
  );
}


/* Pictures on your card page: up to six. */
function VipMedia21({ list, onChange }) {
  const { dispatch } = useStore();
  const ref = useRef(null);
  const Plus = vipIcon21("Plus"), X = vipIcon21("X");
  const add = async (e) => {
    const files = Array.from(e.target.files || []); e.target.value = "";
    const out = [...list];
    for (const file of files) {
      if (out.length >= 6) { dispatch({ type: "TOAST", toast: "Six pictures is the most" }); break; }
      if (file.size > MAX_MEDIA_BYTES) { dispatch({ type: "TOAST", toast: "That picture is too large" }); continue; }
      try { out.push({ id: uid("vm"), src: await readFileAsDataUrl(file) }); } catch (x) { dispatch({ type: "TOAST", toast: "That picture could not be read" }); }
    }
    onChange(out);
  };
  return (
    <div className="ff-v21-media">
      {list.map(m => <span key={m.id} className="m"><img decoding="async" src={m.src} alt="" /><button type="button" aria-label="Remove picture" onClick={() => onChange(list.filter(x => x.id !== m.id))}><X size={14} /></button></span>)}
      {list.length < 6 ? <button type="button" className="add" onClick={() => ref.current && ref.current.click()} aria-label="Add pictures"><Plus size={22} /></button> : null}
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={add} />
    </div>
  );
}


function VipWallet21({ open, onClose, card }) {
  const { dispatch } = useStore();
  return (
    <Sheet open={open} onClose={onClose} title="Add to wallet" center>
      <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
        <VipCard21 card={card} />
        <div className="ff-v21-wallet" style={{ width: "100%", maxWidth: 440 }}>
          <button type="button" onClick={() => { onClose(); dispatch({ type: "TOAST", toast: "Apple Wallet passes arrive with the FF VIP launch" }); }}>Add to Apple Wallet</button>
          <button type="button" onClick={() => { onClose(); dispatch({ type: "TOAST", toast: "Google Wallet passes arrive with the FF VIP launch" }); }}>Add to Google Wallet</button>
        </div>
      </div>
    </Sheet>
  );
}


/* Your VIP card: the same page as the VIP Host Card, with your pictures beside the card. */
function VipCardPage21() {
  const { state, dispatch } = useStore();
  const v = state.vip21 || {};
  const tag = (state.session && state.session.tag) || "";
  const [c, setC] = useState(() => ({ name: (v.card && v.card.name) || state.profile.name || "", photo: "", drinks: [], interests: [], diet: [], allergies: "", vibes: [], care: "", seat: "", media: [], ...(v.card || {}) }));
  const [wallet, setWallet] = useState(false);
  const done = vipCardDone21(v);
  const set = (p) => setC(x => ({ ...x, ...p }));
  const W = vipIcon21("Wine"), H = vipIcon21("Heart"), S = vipIcon21("Sparkles"), L = vipIcon21("Leaf"), Im = vipIcon21("Images"), U = vipIcon21("Armchair");
  const stock = ["training_mixology", "reward_bar_kit", "jr_menuteam"].map(k => ({ id: "stock_" + k, src: vipImg21(k), name: "" })).filter(m => m.src);
  const own = (c.media || []).filter(m => m.src);
  const save = () => {
    if (!String(c.name || "").trim()) { dispatch({ type: "TOAST", toast: "Add your name" }); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const first = !v.guest;
    const guest = v.guest || { ref: vipRef21("VG"), at: Date.now() };
    vipPatch21(dispatch, state, { card: { ...c, name: c.name.trim(), savedAt: Date.now() }, guest });
    if (first) {
      const cur = fdOf(state), ref = guest.ref;
      const rec = {
        id: uid("lsr"), ref, key: ref, kind: "vip_guest", siteKey: "vip", locationId: null, locationText: VIP21.party.place,
        roles: [], eventDate: null, dateUndecided: true, tz: "Europe/London",
        contact: { name: c.name.trim(), email: "", phone: "", whatsappOk: true },
        headcount: "1", brief: "Launch party guest list | " + [c.drinks.slice(0, 3).join(", "), c.diet.join(", ")].filter(Boolean).join(" | "), companyId: null, companyName: "",
        createdAt: new Date().toISOString(), status: "new", assignee: "", adminNote: "", eventId: null,
        sourcePath: "", sourceSite: "vip", notif: { admin: "simulated", ack: "simulated message", failed: false }, bookingId: null,
      };
      fdSet(state, dispatch, { requests: [rec, ...cur.requests], log: [{ at: rec.createdAt, by: "visitor", what: "vip_guest " + ref, site: "vip" }, ...cur.log].slice(0, 200) });
    }
    dispatch({ type: "TOAST", toast: first ? "Card saved. You are on the guest list" : "VIP card saved" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const share = () => vipShare21(`${c.name || "I"} on FF VIP: https://${VIP21.domain}/${VIP21.slug(state)}`);
  const head = (Icon, title) => <SectionHead icon={<Icon size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={title} />;
  return (
    <div className="ff-home ff-home11 ff-v21">
      <style>{VIP21_CSS}</style>
      <div className="ff-host17">
        <div className="ff-eyebrow">FF VIP · VIP Card</div>
        {v.guest ? <div className="ff-v21-guest" role="status" style={{ margin: "8px 0", color: "inherit", background: "rgba(165,128,47,.14)", borderColor: "rgba(165,128,47,.6)" }}>On the launch party guest list {"·"} {VIP21.party.when}, {VIP21.party.place}</div> : null}
        <PublicHero media={own.length ? own : stock} card={<VipCard21 card={c} tag={tag} edit set={set} />} below={<>
          <section style={{ marginTop: 22 }}>{head(W, "Favourite drinks")}<VipChips21 list={VIP21_DRINKS} value={c.drinks} onChange={(x) => set({ drinks: x })} custom="Add your own" /></section>
          <section style={{ marginTop: 22 }}>{head(S, "Your personality")}<VipChips21 list={VIP21_VIBES} value={c.vibes} onChange={(x) => set({ vibes: x })} /></section>
          <section style={{ marginTop: 22 }}>{head(H, "Interests")}<VipChips21 list={VIP21_INTERESTS} value={c.interests} onChange={(x) => set({ interests: x })} custom="Add your own" /></section>
          <section style={{ marginTop: 22 }}>{head(Im, "Pictures")}<VipMedia21 list={c.media || []} onChange={(media) => set({ media })} /></section>
          <section style={{ marginTop: 22 }}>{head(U, "Looking after you")}
            <div className="ff-v21-form">
              <label><span className="ff-v21-k">Where you like to sit</span><select className="ff-v21-in" value={c.seat} onChange={(e) => set({ seat: e.target.value })} aria-label="Where you like to sit"><option value="">No preference</option>{VIP21_SEATS.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
              <label><span className="ff-v21-k">How you like to be looked after</span><textarea className="ff-v21-in" rows={3} value={c.care} onChange={(e) => set({ care: e.target.value })} aria-label="How you like to be looked after" /></label>
            </div></section>
          <section style={{ marginTop: 22 }}>{head(L, "Dietary needs")}
            <VipChips21 list={VIP21_DIET} value={c.diet} onChange={(x) => set({ diet: x })} />
            <label style={{ display: "block", marginTop: 12 }}><span className="ff-v21-k">Allergies and anything else</span><input className="ff-v21-in" value={c.allergies} onChange={(e) => set({ allergies: e.target.value })} aria-label="Allergies and anything else" /></label>
          </section>
          {done ? <div className="ff-v21-btns" style={{ marginTop: 22 }}><VipShine21 onClick={() => setWallet(true)}>Add to wallet</VipShine21><Btn onClick={share}>Share my card</Btn></div> : null}
        </>} />
        <ConfirmSpin17 lines={["Save"]} label={v.guest ? "Save VIP card" : "Save VIP card and join the guest list"} onClick={save} />
        <VipRewardsSect21 />
      </div>
      <VipWallet21 open={wallet} onClose={() => setWallet(false)} card={c} />
    </div>
  );
}


function VipRouter21() {
  const { state } = useStore();
  const { tab } = state;
  if (state.viewing) return React.createElement(PersonProfile, null);
  if (tab === "network") return React.createElement(VipExperiences21, null);
  if (tab === "bookings") return React.createElement(VipBook21, null);
  if (tab === "profile") return React.createElement(VipCardPage21, null);
  return React.createElement(VipHome21, null);
}


function TeamRouter() {
  const { state } = useStore();
  const { tab } = state;
  if (state.viewing) return <PersonProfile />;
  if (tab === "network") return <NetworkScreen />;
  if (tab === "bookings") return PHASE1.bookingsLive ? <TeamBookings /> : <P1Bookings />;
  if (tab === "profile") return <ProfileGate17 kind="team" />;
  return <TeamHomeV17 />;
}


function StaffRouter() {
  const { state } = useStore();
  const { route, tab } = state;
  if (state.viewing)
    return React.createElement(PersonProfile, null);
  if (tab === "network")
    return React.createElement(StaffRoster, null);
  if (tab === "bookings")
    return React.createElement(StaffBookings, null);
  if (tab === "profile")
    return React.createElement(ProfileGate17, {
      kind: state.site === "party" ? "party" : "biz"
    });
  const Home = state.site === "party" ? V101.PartyHome11 : V101.StaffHome11;
  if (route === "cocktails")
    return React.createElement(CocktailsPage, null);
  if (route === "eventNew")
    return React.createElement(Home, null);
  if (route === "eventPage" || route === "shiftNew" || route === "shiftSend")
    return state.activeEventId ? React.createElement(EventPage, null) : React.createElement(Home, null);
  if (route === "companyEdit")
    return React.createElement(StaffProfile, null);
  return React.createElement(Home, null);
}
