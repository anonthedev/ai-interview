"use client"

// import 'codemirror/lib/codemirror.css'
import { useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { languages } from '@codemirror/language-data';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';

export default function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  console.log(languages)
  return (
    <section className='text-black'>
      <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
        {languages.map((language) => (
          <option key={language.name} value={language.name}>
            {language.name}
          </option>
        ))}
      </select>
      <CodeMirror
        height='50vh'
        width='50vw'
        basicSetup = {
          {
            autocompletion: true,
            syntaxHighlighting: true,
            lineNumbers: true,
          }
        }
      />
    </section>
  )

}
