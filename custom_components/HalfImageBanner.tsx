import Image from "next/image"
import Link from "next/link";

interface halfImageBannerData {
    imageSrc: string,
    imageAltText: string
    imageSide: string
    title: string
    text: string
    buttonText?: string
    buttonLink?: string

}

export default function HalfImageBanner(props: halfImageBannerData) {

    return (
        <section className="lg:w-7xl w-full m-auto flex flex-col lg:flex-row items-center justify-between px-10 py-16 text-blue-950 gap-12 border-b-yellow-800 border-b-1 to-hide">
            {/* Image Side */}
            {props.imageSide == "left" &&
                <div className="w-full lg:w-1/2 flex justify-center">
                    <Image
                        src={props.imageSrc}
                        alt={props.imageAltText}
                        width={500} // adjust as needed
                        height={400} // adjust as needed
                        className="rounded-md shadow-lg max-w-full h-auto object-cover"
                    />
                </div>
            }

            {/* Text Side */}
            <div className="w-full lg:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold text-gold-500">{props.title}</h2>
                <p className="text-lg text-gray-700">
                    {props.text}
                </p>
                {/* only render button if there is a route for it */}
                {(props.buttonLink && props.buttonLink) &&
                    <Link href={props.buttonLink}>
                        <button className="mt-4 px-3 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-md transition-all duration-200">
                            {props.buttonText}
                        </button>
                    </Link>
                }

            </div>

            {props.imageSide == "right" &&
                <div className="w-full lg:w-1/2 flex justify-center">
                    <Image
                        src={props.imageSrc}
                        alt={props.imageAltText}
                        width={500}
                        height={400}
                        className="rounded-md shadow-lg max-w-full h-auto object-cover"
                    />
                </div>
            }
        </section>

    )
}