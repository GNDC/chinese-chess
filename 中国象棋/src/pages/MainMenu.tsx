import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Users, ArrowLeft } from 'lucide-react';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-amber-900 mb-4 tracking-wider">
          中国象棋
        </h1>
        <p className="text-xl text-amber-700">传统智慧，现代演绎</p>
      </div>
      
      <div className="flex flex-col gap-6 w-full max-w-md">
        <button
          onClick={() => navigate('/rules')}
          className="group flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-amber-800 transform hover:-translate-y-1 transition-all duration-300"
        >
          <BookOpen className="w-10 h-10 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="text-2xl font-bold">规则讲解</div>
            <div className="text-amber-200 text-sm">学习象棋基础知识</div>
          </div>
        </button>
        
        <button
          onClick={() => navigate('/ai')}
          className="group flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transform hover:-translate-y-1 transition-all duration-300"
        >
          <Trophy className="w-10 h-10 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="text-2xl font-bold">人机对战</div>
            <div className="text-red-200 text-sm">挑战AI，提升棋艺</div>
          </div>
        </button>
        
        <button
          onClick={() => navigate('/vs')}
          className="group flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-900 transform hover:-translate-y-1 transition-all duration-300"
        >
          <Users className="w-10 h-10 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="text-2xl font-bold">双人对战</div>
            <div className="text-gray-300 text-sm">与朋友同场竞技</div>
          </div>
        </button>
      </div>
      
      <div className="mt-16 text-amber-600 text-sm">
        单击按钮开始游戏
      </div>
    </div>
  );
};

export default MainMenu;
