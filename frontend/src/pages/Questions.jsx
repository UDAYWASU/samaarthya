import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";

export default function Questions() {
  
  const { state } = useLocation();
  const navigate = useNavigate();
  const { level, domain , interviewId } = state || {};
  const user = JSON.parse(localStorage.getItem("user"));
  const [tabSwitched, setTabSwitched] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [timer, setTimer] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const videoRef = useRef(null);
  const [codeAnswer, setCodeAnswer] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  //const [interviewId, setInterviewId] = useState(null);
  const { theme } = useTheme();
  const backgroundImage = "/images/interview-bg.png"; // Your custom background
  const hasImage = !!backgroundImage;

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      window.alert("Interview terminated: You switched tabs or minimized the window.");
      setTabSwitched(true); // Flag the tab switch
      stopRecording(); // Stop any ongoing recording
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
      setInterviewComplete(true); // End the interview
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [mediaStream]);



// 1. Fetch Questions
useEffect(() => {
  fetch(`http://localhost:4000/api/questions?level=${level}&domain=${domain}`)
    .then(res => res.json())
    .then(data => setQuestions(data))
    .catch(console.error);
}, [level, domain]);

// 2. Create Interview after questions are available
  // 2. Create Interview after questions are available
  

  useEffect(() => {
    const t = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (tabSwitched) return;
    if (showCountdown) {
      if (countdown > 0) {
        const id = setTimeout(() => setCountdown(countdown - 1), 1000);
        if (countdown === 8) startRecording();
        return () => clearTimeout(id);
      } else {
        console.log("Start answering!");
      }
    }
  }, [countdown, showCountdown]);

  useEffect(() => {
    if (tabSwitched) return;
    if (questions.length > 0 && current < questions.length) {
      const audioPath = questions[current].audio_path;
      if (audioPath) {
        const audio = new Audio(audioPath);
        audio.play().catch(err => console.log("No audio available."));
      }
      setCountdown(10);
      setShowCountdown(true);
    }
  }, [current, questions]);

  useEffect(() => {
    if (tabSwitched) return;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  useEffect(() => {
    
    if (interviewComplete && redirectCountdown > 0) {
      const intervalId = setTimeout(() => setRedirectCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(intervalId);
    } else if (interviewComplete && redirectCountdown === 0) {
      navigate("/dashboard");
    }
  }, [interviewComplete, redirectCountdown, navigate]);

  const startRecording = () => {
    if (mediaStream) {
      chunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      mediaRecorderRef.current.ondataavailable = e => chunksRef.current.push(e.data);
      mediaRecorderRef.current.start();
    }
  };






const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });

      const now = new Date();
      const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}_${now
        .getHours()
        .toString()
        .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}-${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      const fileName = `${user?.name || "user"}_${timestamp}.webm`;

      const formData = new FormData();
      formData.append("video", blob, fileName);

      try {
        const res = await fetch("http://localhost:4000/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        console.log("Video uploaded:", data);

        const videoPath = data.path || fileName; // make sure backend returns 'path'
        const question = questions[current];
        const isCoding = question.question_type === "coding";

        await fetch("http://localhost:4000/api/interviews/question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interview_id: interviewId,
            question_number: current + 1,
            question_text: question.question_text,
            question_type: question.question_type,
            video_path: videoPath,
            code_answer: isCoding ? codeAnswer : null,
          }),
        }).then((res) => res.json()).then(console.log).catch(console.error);

      } catch (err) {
        console.error("Upload or DB update failed:", err);
      }
    };

    mediaRecorderRef.current.stop();
  }
};
 




const handleNext = () => {
  if (tabSwitched) return; // Don't allow progression
    // if (countdown > 2) {
    //   alert("Please wait until the thinking time is over before proceeding.");
    //   return;
    // }
  stopRecording();
  setShowCountdown(false);
  setCodeAnswer("");

  if (current + 1 >= questions.length) {
    setInterviewComplete(true);
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  } else {
    setCurrent(current + 1);
  }
};




  // const handleNext = () => {
  //   // if (countdown > 2) {
  //   //   alert("Please wait until the thinking time is over before proceeding.");
  //   //   return;
  //   // }

  //   stopRecording();
  //   setShowCountdown(false);
  //   setCodeAnswer("");

  //   if (current + 1 >= questions.length) {
  //     setInterviewComplete(true);
  //     if (mediaStream) {
  //       mediaStream.getTracks().forEach(track => track.stop());
  //       setMediaStream(null);
  //     }
  //   } else {
  //     setCurrent(current + 1);
  //   }
  // };

  if (!questions.length) return <div className="text-center py-20 text-lg text-gray-500">Loading questions...</div>;

  if (interviewComplete) return (
    <div className="text-center py-20 text-2xl font-bold text-green-600">
      Interview complete!
      <div className="text-base font-medium text-gray-600 mt-4">
        Redirecting to dashboard in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
      </div>
    </div>
  );

  const question = questions[current];
  const isCoding = question.question_type === "coding";

   return (
    <div
      className="min-h-screen p-6 flex flex-col items-center transition-all duration-300"
      style={{
        backgroundImage: hasImage ? `url('${backgroundImage}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: !hasImage
          ? theme === "dark"
            ? "#0f172a"
            : "#f9fafb"
          : undefined,
      }}
    >
      {/* Timer Info */}
      <div className="flex flex-col sm:flex-row justify-between w-full max-w-6xl text-md text-gray-800 dark:text-gray-300 mb-6 font-medium gap-4">
        <div>
          Interview Timer:{" "}
          <span className="font-bold text-indigo-700 dark:text-indigo-400">{timer}s</span>
        </div>
        <div>
          Thinking Time Left:{" "}
          <span className="font-bold text-red-600 dark:text-red-400">{countdown}s</span>
        </div>
      </div>

      {/* Main Layout: Video + Q&A */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full items-start">
        {/* Static Video Panel */}
        <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[50%] aspect-[4/3] max-h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-700 bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
      </div>


        {/* Q&A Panel */}
        <div className="w-full lg:w-[65%] backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Question {current + 1}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
            {question.question_text}
          </p>

          {isCoding && (
            <textarea
              rows={10}
              className="w-full mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Write your code here..."
              value={codeAnswer}
              onChange={(e) => setCodeAnswer(e.target.value)}
            />
          )}

          <div className="text-right">
            <button
              onClick={handleNext}
              disabled={tabSwitched}
              className={`mt-4 px-6 py-3 ${
                tabSwitched ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-semibold rounded-xl shadow-lg transition-all`}
            >
              Next Question
            </button>

          </div>
        </div>
      </div>
    </div>
  );


}