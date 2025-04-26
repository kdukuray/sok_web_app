import Link from "next/link";

interface BannerProps {
  text: string;
  buttonLink: string;
  buttonText: string;
  title: string;
}

export default function Banner(props: BannerProps) {
  return (
    <div>
      <div className="h-dvh bg-cover flex flex-col justify-center items-center opacity-95 bg-[url(/images/masjid_landscape_1.png)] p-4">
        <div className="text-white font-bold text-center text-shadow-sm text-shadow-black max-w-2xl">
          <h3 className="text-5xl md:text-4xl sm:text-3xl mb-2">{props.title}</h3>
          <p className="text-white text-lg md:text-base sm:text-sm w-full font-bold mt-2">
            {props.text}
          </p>
        </div>
        <div className="mt-4">
          <Link href={props.buttonLink}>
            <button className="bg-amber-500 text-white h-10 w-32 md:w-28 sm:w-24 text-sm md:text-base rounded-sm cursor-pointer">
              {props.buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
