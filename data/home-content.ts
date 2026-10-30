export type CommunityEvent = {
  date: string;
  title: string;
  kind: string;
  place: string;
  color: string;
};

export const upcomingEvents: CommunityEvent[] = [
  { date: "SOON", title: "A Pune making table", kind: "workshop", place: "Pune", color: "#f7e914" },
  { date: "SOON", title: "Draw what you hear", kind: "creative play", place: "Pune", color: "#a9d4f4" },
  { date: "SOON", title: "Tiny things, big joy", kind: "pop-up", place: "Pune", color: "#f3c5ce" }
];

export const portfolioProjects = [
  { title: "Tidy code", tag: "code stuff", note: "Turning messy problems into calm little tools." },
  { title: "Margin art", tag: "maker mode", note: "Sketches, scraps and colour tests, just for fun." },
  { title: "Good chats", tag: "people stuff", note: "Best ideas show up mid-conversation." },
  { title: "Still learning", tag: "currently", note: "New tools, new crafts, whatever is next." }
] as const;

export const processSteps = [
  ["01", "Make room for wonder", "Follow the little idea that keeps tapping you on the shoulder."],
  ["02", "Learn out loud", "Pick up a new material, skill, or perspective—bad first drafts welcome."],
  ["03", "Find your people", "Meet someone who is also figuring it out, making it up, or starting fresh."],
  ["04", "Pass it on", "Leave with a new practice, a new person, or a reason to make another thing."]
] as const;
