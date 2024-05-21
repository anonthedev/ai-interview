"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useJobDetails, useInterviewFlow } from "@/zustand/state"
import Showdown from "showdown"
import { useState } from "react"

export default function ConfigureInterview() {
    const { updateExp, updateDomain, updateJobDesc, updateSkills, updateResume, jobDesc, skills, experience, domain, resume } = useJobDetails((state: any) => state)

    const { updateInterviewFlow, interviewFlow } = useInterviewFlow((state: any) => state)

    const [loading, setLoading] = useState<boolean>()
    // const [interviewFlow, setInterviewFlow] = useState<any>()

    function convertMarkdownToHTML(markdownString: string) {
        let converter = new Showdown.Converter(),
            html = converter.makeHtml(markdownString);
        return html;
    }

    function handleFileChange(e: any) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file)
        if (file) {
            fetch(`/api/readPDF`, {
                method: 'POST',
                body: formData,
            })
                .then((data) => data.json())
                .then((resp) => {
                    updateResume(resp.text)
                })
        }
    }

    async function getInterviewFlow() {
        updateInterviewFlow()
        setLoading(true)
        await fetch(`/api/interview-flow?experience=${experience}&jobDesc=${jobDesc}&skills=${skills}&domain=${domain}&resume=${resume}`)
            .then((data) => data.json())
            .then((resp) => {
                setLoading(false)
                updateInterviewFlow(convertMarkdownToHTML(resp.resp))
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    return (
        <main className="text-white w-screen h-screen flex flex-row items-center justify-center gap-5 p-10 lg:flex-col lg:h-auto lg:p-5">
            <section className="w-1/2 h-fit flex flex-col items-center justify-center gap-5 lg:max-w-prose lg:w-full">
                <div className="flex flex-row w-full justify-between">
                    <Select value={domain} onValueChange={(e) => { updateDomain(e) }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue defaultValue={"frontend"} placeholder="Select the domain" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="frontend" >Frontend</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={experience} onValueChange={(e) => {
                        updateExp(e)
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Years of Experience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0-1 years of exp" >0-1 years</SelectItem>
                            <SelectItem value="1-3 years of exp" >1-3 years</SelectItem>
                            <SelectItem value="3-5 years of exp" >3-5 years</SelectItem>
                            <SelectItem value="5+ years of exp" >5+ years</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Input value={skills} onChange={(e) => { updateSkills(e.target.value) }} className="w-full" placeholder="Put in your skills (Javascript, React, Next.js...)" />

                <Input type="file" onChange={handleFileChange} className="w-full" placeholder="Put in your skills (Javascript, React, Next.js...)" />

                <Textarea className="w-full" value={jobDesc} onChange={(e) => { updateJobDesc(e.target.value) }} placeholder="Put in a Job Description (optional)" cols={55} rows={21} />

                <Button disabled={loading} className={`${loading ? "opacity-50" : "opacity-100"}`} onClick={getInterviewFlow}>{loading ? "Loading..." : "Generate Flow"}</Button>
            </section>
            <section className="w-1/2 h-full flex flex-col justify-center items-center gap-5 lg:max-w-[65ch] lg:w-full">
                {!interviewFlow && <div className="border-[0.5px] rounded-md font-raleway p-5 w-full text-center h-full overflow-auto flex flex-col gap-1 items-center justify-center text-gray-600 max-w-prose xl:h-1/2">
                    {!loading ? "Interview Flow will be shown here..." : loading ? "Loading..." : null}
                </div>}

                {interviewFlow && <div className="border-[0.5px] rounded-md font-poppins p-5 w-full h-full  overflow-auto flex flex-col gap-1 text-gray-300 max-w-prose xl:h-1/2" dangerouslySetInnerHTML={{ __html: !loading && interviewFlow }}></div>}

                <Button disabled={!interviewFlow || loading} variant={"primary"} asChild>
                    <Link className={`${!interviewFlow || loading ? "opacity-50" : "opacity-100"}`} href={`${!interviewFlow || loading ? "#" : "/conceptual-round"}`}>Proceed to Interview</Link>
                </Button>
            </section>
        </main>
    )
}
