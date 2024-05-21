import Link from "next/link";
import { Button } from "./ui/button";

export default function LandingPage() {
    return (
        <main className="flex flex-col justify-between w-screen h-screen p-5 md:justify-center">
            <nav>
                {/* <Button>Take an interview</Button> */}
            </nav>
            <section className="">
                <div className="flex flex-col mb-24 gap-8 md:text-center md:items-center md:justify-center md:mb-0">
                    <div className="flex flex-col gap-2 md:gap-5">
                        <h1 className="text-7xl font-bold font-raleway text-yellow-500">Mock interviews by AI.</h1>
                        <h2 className="text-7xl font-bold font-raleway">Challenge yourself.</h2>
                    </div>
                    <Link href={"/configure-interview"} className="bg-yellow-500 text-black rounded-md py-2 px-5 w-fit font-semibold font-raleway">Take an Interview</Link>
                </div>
            </section>
        </main>
    )
}
