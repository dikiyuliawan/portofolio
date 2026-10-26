// Replace bracketed profile values before publishing. No private user data is used.
export const profile = {
  name: "Diki Yuliawan",
  role: "Software Engineer",
  note: "I build useful things, follow curious details, and like software that opens a small door to something better.",
  contactUrl: null, // Your mailto: or https: destination, when you're ready.
};

export const projects = [
  {
    id: "daymark",
    number: "01",
    title: "Daymark",
    category: "Productivity",
    image: "/images/daymark.webp",
    accent: "#c7a54f",
    tagline: "A little room for a better day.",
    description:
      "A productivity experiment about making space for what matters. A small world for everyday plans and a brighter tomorrow.",
    note: "Placeholder project description — replace with the actual features, story, and status.",
    url: null,
  },
  {
    id: "lembar",
    number: "02",
    title: "Lembar",
    category: "Baby-name inspiration",
    image: "/images/lembar.webp",
    accent: "#85926d",
    tagline: "Small names. Big beginnings.",
    description:
      "A gentle space to explore baby-name inspiration. An experiment in finding a name that feels like the beginning of a story.",
    note: "Placeholder project description — replace with the actual features, story, and status.",
    url: null,
  },
  {
    id: "sky-skip",
    number: "03",
    title: "Sky Skip",
    category: "Arcade",
    image: "/images/sky-skip.webp",
    accent: "#4d6fad",
    tagline: "A tiny escape, one more try.",
    description:
      "A bite-sized arcade world built around a simple invitation: pause for a moment, play a little, and try again.",
    note: "Placeholder project description — replace with the actual features, story, and status.",
    url: null,
  },
  {
    id: "solana-scanner",
    number: "04",
    title: "Solana Scanner",
    category: "Read-only / paper trading",
    image: "/images/solana-scanner.webp",
    accent: "#607f63",
    tagline: "A calmer perspective on the signals.",
    description:
      "A read-only / paper trading experiment for exploring Solana market signals. This portfolio does not connect a wallet, execute trades, or handle funds.",
    note: "Read-only / paper trading only. Not financial advice. The project URL has not been provided.",
    url: null,
  },
];

export function safeDestination(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return ["https:", "mailto:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
