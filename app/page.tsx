import Banner from "@/custom_components/Banner";
import HalfImageBanner from "@/custom_components/HalfImageBanner";


interface HalfBanner {
  title: string,
  description: string,
  buttonText: string,
  buttonLink: string,
  imageSrc: string
}

export default function Home() {

  const halfBanner1: HalfBanner = {
    title: "About Our Program",
    description: "Seekers of Knowledge is a community-driven Islamic education program dedicated to teaching young men and women the foundational sciences of Islam—Tawheed, Fiqh, Hadeeth, Qur'an, Tafsir, and more. Held every Wednesday at Masjid Sidiki (1462 Boston Rd, Bronx, NY) and led by Sheikh Abdul Rashid, our goal is to nurture the next generation to worship Allah with knowledge, sincerity, and purpose.",
    buttonText: "Learn More",
    buttonLink: "/about/",
    imageSrc: "child_learning.png"
  }

  const halfBanner2: HalfBanner = {
    title: "Explore the Lessons",
    description: "Dive into our growing library of recorded lectures, class notes, and study materials from the Seekers of Knowledge program. Whether you missed a session or want to review what you’ve learned, this is your hub for continuing your Islamic studies anytime, anywhere.",
    buttonText: "Browse Lessons",
    buttonLink: "/lessons/1",
    imageSrc: "lessons_picture1.png"
  }

  const halfBanner3: HalfBanner = {
    title: "Stay Informed",
    description: "Keep up with the latest announcements from the Seekers of Knowledge program. From schedule changes to upcoming events and special classes, this page ensures you're always connected to what’s happening in the community.",
    buttonText: "View Announcements",
    buttonLink: "/announcements/1",
    imageSrc: "announcements_picture1.png"
  }


  const halfBanner4: HalfBanner = {
    title: "Support the Mission",
    description: "Help us continue nurturing the next generation through Islamic education. Your donation directly supports the Seekers of Knowledge program, providing learning materials, maintaining our space at Masjid Sidiki, and expanding access to weekly classes. Every contribution helps us plant the seeds of knowledge and faith.",
    buttonText: "Donate Now",
    buttonLink: "/donations/",
    imageSrc: "donations_picture1.png"
  }

  const halfbanners: HalfBanner[] = [halfBanner1, halfBanner2, halfBanner3, halfBanner4];


  const sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const sample2 = "Seeking knowledge is an obligation upon every Muslim (طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِم)"
  return (

    <div>
      <Banner text={sample2} title="Seekers of Knowledge" buttonText="Learn More" buttonLink="/about/" ></Banner>
      {halfbanners.map((halfbanner, index) => (
        <HalfImageBanner key={index}
          imageSrc={`/images/${halfbanner.imageSrc}`}
          imageSide={index % 2 == 0 ? "left" : "right"}
          imageAltText=""
          title={halfbanner.title}
          text={halfbanner.description}
          buttonText={halfbanner.buttonText}
          buttonLink={halfbanner.buttonLink}>

        </HalfImageBanner>

      ))}

    </div>
  );
}
