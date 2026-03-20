'use client';
import data from './questions.json';
import { useState, useEffect } from 'react';

export default function Page(){
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [time,setTime]=useState(2700);
  const [score,setScore]=useState(0);

  const sections = [
    {title:'🧮 Toán', key:'math'},
    {title:'📖 Tiếng Việt', key:'vi'},
    {title:'🇬🇧 Tiếng Anh', key:'eng'},
    {title:'🧠 Logic', key:'logic'}
  ];

  useEffect(()=>{
    if(submitted) return;
    if(time<=0) submit();
    const t=setInterval(()=>setTime(s=>s-1),1000);
    return ()=>clearInterval(t);
  },[time]);

  const submit=()=>{
    let correct=0;
    sections.forEach(sec=>{
      data[sec.key].forEach((q,i)=>{
        const key = sec.key + i;
        if(answers[key]===q.a) correct++;
      });
    });
    setScore(correct);
    setSubmitted(true);
  }

  const format=(t)=>`${Math.floor(t/60)}:${(t%60).toString().padStart(2,'0')}`;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Lean QZZ Final</h1>
        <div className={time<300?'text-red-500':'text-blue-600'}>⏱ {format(time)}</div>
      </div>

      {sections.map(sec=>(
        <div key={sec.key} className="mb-8">
          <h2 className="text-xl font-bold mb-2">{sec.title}</h2>

          {data[sec.key].map((q,i)=>{
            const key = sec.key + i;
            const user = answers[key];
            return (
              <div key={i} className="mb-4">
                <p>{i+1}. {q.q}</p>

                {q.options.map((opt,j)=>{
                  let cls='';
                  if(submitted){
                    if(opt===q.a) cls='text-green-600 font-bold';
                    if(opt===user && opt!==q.a) cls='text-red-600';
                  }

                  return (
                    <label key={j} className={`block ${cls}`}>
                      <input type="radio" disabled={submitted}
                        onChange={()=>setAnswers({...answers,[key]:opt})}
                        className="mr-2"/>
                      {opt}
                    </label>
                  )
                })}

                {submitted && (
                  <p className="text-sm text-gray-500">
                    {user===q.a?'✅ Đúng':'❌ Sai'} - {q.exp}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      ))}

      {!submitted ? (
        <button onClick={submit} className="w-full bg-blue-500 text-white p-3 rounded-xl">
          Nộp bài
        </button>
      ) : (
        <h2 className="text-xl font-bold text-center">🎯 {score}/80</h2>
      )}
    </div>
  )
}
