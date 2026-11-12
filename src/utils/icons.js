/* src/utils/icons.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---- lucide icon adapter -------------------------------------------------
   The lucide UMD build exposes window.lucide.icons, keyed by PascalCase name,
   each value [tag, attrs, children] (children: [tag,attrs][]). Build tiny
   React components from that data so call sites can use <Briefcase/> etc.
   exactly as in the original lucide-react source. */
function lucideIcon(name) {
  return function LIcon({ size = 24, color = "currentColor", strokeWidth = 2, style, className, ...rest }) {
    const def = window.lucide && window.lucide.icons && window.lucide.icons[name];
    if (!def) return null;
    const [, , children] = def;
    return React.createElement(
      "svg",
      {
        width: size, height: size, viewBox: "0 0 24 24", fill: "none",
        stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
        style, className, ...rest,
      },
      (children || []).map((c, i) => React.createElement(c[0], { key: i, ...c[1] }))
    );
  };
}


const Briefcase = lucideIcon("Briefcase"), SlidersHorizontal = lucideIcon("SlidersHorizontal"),
  Heart = lucideIcon("Heart"), MapPin = lucideIcon("MapPin"), MessageSquare = lucideIcon("MessageSquare"),
  Hash = lucideIcon("Hash"), Award = lucideIcon("Award"), Car = lucideIcon("Car"),
  Upload = lucideIcon("Upload"), FileText = lucideIcon("FileText"), Check = lucideIcon("Check"),
  X = lucideIcon("X"), Pencil = lucideIcon("Pencil"), Eye = lucideIcon("Eye"), EyeOff = lucideIcon("EyeOff"),
  ChevronRight = lucideIcon("ChevronRight"), ChevronLeft = lucideIcon("ChevronLeft"), Plus = lucideIcon("Plus"),
  Users = lucideIcon("Users"), Calendar = lucideIcon("Calendar"), Clock = lucideIcon("Clock"),
  Bookmark = lucideIcon("Bookmark"), User = lucideIcon("User"), Home = lucideIcon("Home"),
  Share2 = lucideIcon("Share2"), Loader2 = lucideIcon("Loader2"), Phone = lucideIcon("Phone"),
  ShieldCheck = lucideIcon("ShieldCheck"), Send = lucideIcon("Send"), Wallet = lucideIcon("Wallet"),
  PenLine = lucideIcon("PenLine"), Search = lucideIcon("Search"), AlertCircle = lucideIcon("AlertCircle"),
  Martini = lucideIcon("Martini"), Music = lucideIcon("Music"), Mic = lucideIcon("Mic"),
  ChefHat = lucideIcon("ChefHat"), Camera = lucideIcon("Camera"),
  Lock = lucideIcon("Lock"), Copy = lucideIcon("Copy"), Trash2 = lucideIcon("Trash2"),
  Link2 = lucideIcon("Link2"), Receipt = lucideIcon("Receipt"), Sparkles = lucideIcon("Sparkles"),
  CreditCard = lucideIcon("CreditCard"), Timer = lucideIcon("Timer"), HelpCircle = lucideIcon("HelpCircle"),
  MessageCircle = lucideIcon("MessageCircle"), Download = lucideIcon("Download"), Globe = lucideIcon("Globe"), RotateCcw = lucideIcon("RotateCcw"),
  Star = lucideIcon("Star"), ArrowLeft = lucideIcon("ArrowLeft"), ArrowRight = lucideIcon("ArrowRight"),
  Wine = lucideIcon("Wine"), Tent = lucideIcon("Tent");



const UserPlus = lucideIcon("UserPlus"), PartyPopper = lucideIcon("PartyPopper");
