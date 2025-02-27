"use client"

import { useState, useEffect, KeyboardEvent } from "react";

export default function Home() {
  const ANSWER = [42, 12, 1, 3, 6, 2];
  const [numbers, setNumbers] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState(['', '', '', '', '', '']); // 'up', 'down', 'correct'
  const [locked, setLocked] = useState([false, false, false, false, false, false]);
  const [startTime] = useState(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [gameComplete, setGameComplete] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Add theme toggle effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
      const seconds = (diff % 60).toString().padStart(2, '0');
      setCurrentTime(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleInput = (index: number, value: string) => {
    if (locked[index] || gameComplete) return;
    
    const newNumbers = [...numbers];
    newNumbers[index] = value.replace(/[^0-9]/g, '').slice(0, 2);
    setNumbers(newNumbers);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      const inputNum = parseInt(numbers[index]);
      if (isNaN(inputNum)) return;

      const newStatus = [...status];
      const newLocked = [...locked];

      if (inputNum === ANSWER[index]) {
        newStatus[index] = 'correct';
        newLocked[index] = true;
      } else if (inputNum < ANSWER[index]) {
        newStatus[index] = 'up';
      } else {
        newStatus[index] = 'down';
      }

      setStatus(newStatus);
      setLocked(newLocked);

      // Check if game is complete
      if (newLocked.every(l => l)) {
        setGameComplete(true);
        setEndTime(new Date());
      }
    }
  };

  const handleShare = () => {
    const timeText = endTime ? 
      `${Math.floor((endTime.getTime() - startTime.getTime()) / 1000)}초` : 
      currentTime;
    const shareText = `Daile - 오늘의 로또 번호를 ${timeText}만에 맞췄어요! 🎉\n`;
    navigator.clipboard.writeText(shareText);
    alert('결과가 클립보드에 복사되었습니다!');
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-16 dark:bg-gray-900 dark:text-white">
      {/* Remove the header with back/forward buttons */}
      <main className="flex flex-col items-center gap-6 max-w-xl w-full">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">Daile - 로또 번호 맞추기</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
        
        <div className="space-y-2 self-start">
          <p><span className="text-blue-500">1000</span>번째 새롭게 생성되는 로또 번호를 예측해보세요</p>
          <p>로또 번호를 맞춘 사람은 <span className="text-blue-500">10</span>명입니다</p>
          <p>로또 번호를 맞추는데 걸린 최단시간은 <span className="text-blue-500">10:00</span>입니다</p>
        </div>

        <div className="w-full text-center">
          <p className="mt-4">시간 : {currentTime}</p>
        </div>

        <div className="flex gap-4 mt-4">
          {numbers.map((number, index) => (
            <div key={index} 
                 className={`relative w-16 h-24 border rounded-md flex items-center justify-center text-2xl font-bold
                            dark:border-gray-600
                            ${status[index] === 'correct' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}>
              {status[index] === 'up' && 
                <div className="absolute -top-2 text-xs text-white bg-red-500 px-2 rounded">up ↑</div>
              }
              {status[index] === 'down' && 
                <div className="absolute -bottom-2 text-xs text-white bg-blue-500 px-2 rounded">down ↓</div>
              }
              <input
                type="text"
                value={number}
                onChange={(e) => handleInput(index, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                disabled={locked[index]}
                className={`w-full h-full text-center bg-transparent 
                          ${status[index] === 'correct' ? 'text-white dark:text-black' : 'dark:text-white'}
                          disabled:opacity-100`}
                maxLength={2}
              />
            </div>
          ))}
        </div>

        {gameComplete && (
          <div className="text-center space-y-4">
            <p className="text-2xl">🎉 축하합니다! 🎉</p>
            <p>걸린 시간: {currentTime}</p>
            <button 
              onClick={handleShare}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              결과 공유하기
            </button>
          </div>
        )}
        <section className="mt-8 w-full max-w-xl">
          <h2 className="text-xl font-bold mb-4">질문과 답변</h2>
          <div className="space-y-10">
            <div>
              <p className="font-bold">Q. Daile는 무엇인가요?</p>
              <p className="mt-2">A. Daile는 로또 번호를 맞히는 게임입니다. 정답 번호를 추측하면 추측한 번호가 정답 번호보다 작은지, 큰지 알려줍니다. 가장 근접한 번호를 찾아가며 로또를 맞춰보세요</p>
            </div>
            <div>
              <p className="font-bold">Q. 하루에 한 번 이상 플레이할 수는 없나요?</p>
              <p className="mt-2">Daile은 하루에 여러 번 플레이할 수 있습니다. 새로고침을 통해 새로운 로또 번호를 맞힐 수 있습니다</p>
              <p>정답 번호는 난수로 리로드마다 초기화됩니다.</p>
            </div>
            <div>
              <p className="font-bold">Q. 다른 질문이나 피드백은 어떻게 보내나요?</p>
              <p className="mt-2">메일로 문의해주세요.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}