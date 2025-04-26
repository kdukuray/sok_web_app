import HalfImageBanner from "@/custom_components/HalfImageBanner";

interface HalfBanner {
    title: string,
    description: string,
    buttonText?: string,
    buttonLink?: string,
    imageSrc: string
}

export default function About() {
    // About
    const halfBanner1: HalfBanner = {
        title: "About Our Program",
        description:
            "Seekers of Knowledge is a community‑driven Islamic education program dedicated to teaching young men and women the foundational sciences of Islam—Tawḥīd, Fiqh, Ḥadīth, Qur’an, Tafsīr, and more. Held every Wednesday at Masjid Sidiki (1462 Boston Rd, Bronx, NY) and led by Shaykh Abdul Rashid, our goal is to nurture the next generation to worship Allah with knowledge, sincerity, and purpose.",
        imageSrc: "child_learning.png",
    };

    // 2 — Our Mission
    const halfBanner2: HalfBanner = {
        title: "Our Mission",
        description:
            "We safeguard and transmit the timeless wisdom of Islam, cultivating hearts and minds that worship Allah ﷻ with clarity, devotion, and sound understanding. Everything we do is driven by service to God and community.",
        imageSrc: "about_page_image1.png",
    };

    // 3 — What We Teach
    const halfBanner3: HalfBanner = {
        title: "What We Teach",
        description:
            "Structured study circles cover Tawḥīd, Fiqh, Ḥadīth, Qur’an recitation & memorization, Tafsīr, and essential adab. Each discipline is delivered in plain language, rooted in classical texts, and connected to modern life.",
        imageSrc: "about_page_image2.png",
    };

    // 4 — When & Where
    const halfBanner4: HalfBanner = {
        title: "When & Where",
        description:
            "Classes convene every Wednesday after Maghrib at Masjid Sidiki, 1462 Boston Rd, Bronx, NY 10459. Seasonal prayer‑time adjustments ensure the program fits neatly into your evening schedule.",
        imageSrc: "about_page_image3.png",
    };

    // 5 — Meet the Teacher
    const halfBanner5: HalfBanner = {
        title: "Meet Shaykh Abdul Rashid",
        description:
            "Trained in the traditional Islamic sciences overseas and now serving New York City for over a decade, Shaykh Abdul Rashid makes complex topics accessible through relatable examples and a warm, welcoming style.",
        buttonText: "Teacher Bio",
        buttonLink: "https://sites.google.com/site/masjidsidik/teachers/ustadh-abdul-rashid",
        imageSrc: "about_page_image6.jpg",
    };

    // - Who can attend
    const halfBanner6: HalfBanner = {
        title: "Who Can Attend?",
        description:
            "Everyone is welcome—people of all ages and backgrounds are invited to learn and grow together in a warm, supportive environment.",
        imageSrc: "about_page_image4.png",
    };

    // 7 — How to Join
    const halfBanner7: HalfBanner = {
        title: "How to Join",
        description:
            "Anyone can come—just show up! No registration or fees required. Drop in, settle down, and enjoy an evening of learning. Donations to support the masjid and program are appreciated but never expected.",
        buttonText: "Join Whatsapp Grorp",
        buttonLink: "#",
        imageSrc: "about_page_image5.png",
    };

    const halfbanners: HalfBanner[] = [halfBanner1, halfBanner2, halfBanner3, halfBanner4, halfBanner5, halfBanner6, halfBanner7];

    return (
        <div className="min-h-dvh">
            <div className="h-96 bg-contain flex flex-col justify-center items-center opacity-95 bg-[url(/images/masjid_silhouette.png)]">
                <div className="text-white font-bold text-center text-shadow-sm text-shadow-black">
                    <h3 className="text-5xl mb-2">About Us</h3>
                </div>
            </div>

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
        </div>)
}