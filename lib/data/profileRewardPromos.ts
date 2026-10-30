export type ProfileRewardPromo = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  background: string;
  imageUrl: string;
};

export const PROFILE_REWARD_PROMOS: ProfileRewardPromo[] = [
  {
    id: "scratch",
    title: "Scratch & win",
    subtitle: "Every booking unlocks a new card",
    href: "/rewards",
    background: "#D9F99D",
    imageUrl: "/images/profile/rewards/scratch.png",
  },
  {
    id: "offers",
    title: "Exclusive offers",
    subtitle: "Movies, events, play and activities",
    href: "/rewards",
    background: "#BBF7D0",
    imageUrl: "/images/profile/rewards/offers.png",
  },
  {
    id: "member",
    title: "Member rewards",
    subtitle: "Save more each time you book on VYBE",
    href: "/rewards",
    background: "#FFD6CC",
    imageUrl: "/images/profile/rewards/member.png",
  },
];
