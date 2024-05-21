"use client"

import { useInterviewFlow, useJobDetails } from "@/zustand/state"
import { useEffect, useState } from "react"
import Showdown from "showdown"

export default function ConceptualRound() {
    const { interviewFlow } = useInterviewFlow((state: any) => state)
    const { skills } = useJobDetails((state: any) => state)
    const [respText, setRespText] = useState<Array<string>>([])
    const [question, setQuestion] = useState(`Ask the candidate one question at a time. Don't give the follow up questions or anything just ask the question to the candidate as it'll be asked in a real interview. Keep the follow up questions for after the user has answered the current question.`)

    function convertMarkdownToHTML(markdownString: string) {
        let converter = new Showdown.Converter(),
            html = converter.makeHtml(markdownString);
        return html;
    }

    function handleClick() {
        fetch(`/api/conceptual-round?interviewFlow=${encodeURI(interviewFlow)}&skills=${skills}&query=${question}`)
            .then((data) => data.json())
            .then((resp) => {
                setRespText((respText) => [...respText, convertMarkdownToHTML(resp.question)])
            })
    }

    // useEffect(() => {
    //     fetch(`/api/conceptual-round?interviewFlow=${encodeURI(interviewFlow)}&skills=${skills}`)
    //         .then((data) => data.json())
    //         .then((resp) => { console.log(resp) })
    // }, [interviewFlow, skills])

    return (
        <div>
            {respText.map((question, index) => (
                <span dangerouslySetInnerHTML={{__html: question}} key={index}></span>
            ))}

            <input value={question} onChange={(e) => { setQuestion(e.target.value) }} type="text" />

            <button onClick={handleClick}>Send</button>
        </div>
    )
}
