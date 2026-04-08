import React from 'react'
import { Lesson } from './types'
import { Play, Pause, SkipForward, Volume2, Settings, Maximize } from 'lucide-react'

interface LearningVideoPlayerProps {
  currentLesson: Lesson
  onMarkComplete: () => void
}

export const LearningVideoPlayer: React.FC<LearningVideoPlayerProps> = ({ currentLesson, onMarkComplete }) => {
  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto no-scrollbar pb-24">
      {/* Player Canvas */}
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group border border-[#1B4D2E]/20">
        <img 
          alt="Video Placeholder" 
          className="w-full h-full object-cover opacity-60" 
          src={currentLesson.videoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuD7lv3-KkrhNPLj1EFPgX11VAvcMafO8XbcHnmeRAqP6gE7rZa7RsHOmU8lf9J72ci5Wsm460wbvfow3-eKl7VE2IY-5EFtfbeBWPzKnMp9F92_SB_rCUnPbGT9Rkzn6Dv5RgKL-Y8FQM58y7gqj5A1qnzb5UxXkGG59P46m5ROLxPdClpAJ0KdF6pEoRjAkJCx_zmStNN8Udx0n-2FJW_yKfZmrvN8KQPtyIlyuBK-Idl91vZuPhaPPY1KB2kCkPP4ThL45g7e1Zo"} 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-20 h-20 bg-[#1B4D2E]/90 rounded-full flex items-center justify-center backdrop-blur-sm transform transition-transform hover:scale-110 active:scale-95 group-hover:bg-[#1B4D2E]">
            <Play className="w-8 h-8 text-white ml-1 fill-white" />
          </button>
        </div>
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-full h-1 bg-white/20 rounded-full cursor-pointer relative">
            <div className="absolute top-0 left-0 h-full bg-[#ffb957] w-1/3 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center text-xs text-white pb-1">
            <div className="flex items-center gap-4">
              <button className="hover:text-[#ffb957]"><Pause className="w-5 h-5 fill-current" /></button>
              <button className="hover:text-[#ffb957]"><SkipForward className="w-5 h-5" /></button>
              <button className="hover:text-[#ffb957]"><Volume2 className="w-5 h-5" /></button>
              <span className="font-mono text-[11px]">04:22 / {currentLesson.durationStr}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="hover:text-[#ffb957]"><Settings className="w-5 h-5" /></button>
              <button className="hover:text-[#ffb957]"><Maximize className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-8 max-w-4xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#422800] text-[#ffb957] text-[10px] font-bold rounded-full tracking-widest uppercase">
              KIẾN THỨC NỀN TẢNG
            </span>
            <span className="text-[10px] opacity-50 tracking-widest uppercase text-white font-medium">
              CẬP NHẬT: 15/10/2023
            </span>
          </div>
          
          {!currentLesson.isCompleted && (
            <button 
              onClick={onMarkComplete}
              className="px-5 py-2 bg-[#1b4d2e] hover:bg-[#205e38] text-white rounded-lg text-xs font-bold transition-colors"
            >
              Hoàn thành bài học
            </button>
          )}
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight mb-6 text-white leading-tight">
          {currentLesson.title}
        </h2>
        
        <div className="space-y-6 text-[#f9faf5] opacity-80 leading-relaxed text-base">
          <p>
            Trong học phần này, chúng ta sẽ đi sâu vào mô hình STAR (Situation, Task, Action, Result) - một trong những kỹ thuật phỏng vấn hành vi hiệu quả nhất hiện nay. Giảng viên Khái Nguyễn Hoàng sẽ hướng dẫn cách đặt câu hỏi khơi gợi được những ví dụ thực tế từ kinh nghiệm của ứng viên.
          </p>
          <div className="p-6 bg-[#1A1A1A] rounded-2xl border-l-4 border-[#ffb957]">
            <h4 className="font-bold text-[#ffb957] mb-2 text-sm uppercase tracking-wider">Key Insight</h4>
            <p className="text-sm italic">"Đừng hỏi ứng viên họ sẽ làm gì. Hãy hỏi họ đã làm gì trong quá khứ."</p>
          </div>
        </div>
      </div>
    </div>
  )
}
