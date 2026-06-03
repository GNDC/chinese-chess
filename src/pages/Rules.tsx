import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';

interface RulePage {
  title: string;
  content: React.ReactNode;
}

const Rules: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages: RulePage[] = [
    {
      title: '棋盘与棋子',
      content: (
        <div className="space-y-4">
          <p className="text-lg">中国象棋棋盘由9条竖线和10条横线组成，共90个交叉点。</p>
          <p className="text-lg">棋盘中间没有画通的地方称为"楚河汉界"。</p>
          <p className="text-lg">棋子分为红黑两方，每方16个棋子：</p>
          <ul className="list-disc list-inside text-lg space-y-2 ml-4">
            <li><span className="text-red-700 font-bold">帅（将）</span> - 1个</li>
            <li><span className="text-red-700 font-bold">仕（士）</span> - 2个</li>
            <li><span className="text-red-700 font-bold">相（象）</span> - 2个</li>
            <li><span className="text-red-700 font-bold">馬</span> - 2个</li>
            <li><span className="text-red-700 font-bold">車</span> - 2个</li>
            <li><span className="text-red-700 font-bold">炮（砲）</span> - 2个</li>
            <li><span className="text-red-700 font-bold">兵（卒）</span> - 5个</li>
          </ul>
        </div>
      )
    },
    {
      title: '帅（将）的走法',
      content: (
        <div className="space-y-4">
          <p className="text-lg">帅（将）是棋盘中最重要的棋子，只能在"九宫"内活动。</p>
          <p className="text-lg">走法：每次只能走一格，上下左右均可。</p>
          <p className="text-lg">特殊规则：帅和将不能在同一条直线上直接对面，中间必须有棋子隔开。</p>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-4">
            <p className="text-yellow-800 font-bold">提示：帅（将）被吃掉即输掉比赛！</p>
          </div>
        </div>
      )
    },
    {
      title: '仕（士）的走法',
      content: (
        <div className="space-y-4">
          <p className="text-lg">仕（士）是帅（将）的贴身护卫，也只能在"九宫"内活动。</p>
          <p className="text-lg">走法：每次沿对角线走一格。</p>
        </div>
      )
    },
    {
      title: '相（象）的走法',
      content: (
        <div className="space-y-4">
          <p className="text-lg">相（象）主要负责防守，不能过河。</p>
          <p className="text-lg">走法：每次走"田"字的对角线。</p>
          <p className="text-lg">特殊规则：如果"田"字中心有棋子，称为"塞象眼"，则不能走。</p>
        </div>
      )
    },
    {
      title: '馬的走法',
      content: (
        <div className="space-y-4">
          <p className="text-lg">馬走"日"字，可以过河。</p>
          <p className="text-lg">走法：先直走或横走一格，再斜走一格。</p>
          <p className="text-lg">特殊规则：如果在直走或横走的方向上有棋子，称为"蹩马腿"，则不能走。</p>
        </div>
      )
    },
    {
      title: '車的走法',
      content: (
        <div className="space-y-4">
          <p className="text-lg">車是棋盘中最强大的棋子，可以过河。</p>
          <p className="text-lg">走法：沿直线走，任意格数，只要没有棋子阻挡。</p>
          <p className="text-lg">可以吃掉对方直线上的棋子。</p>
        </div>
      )
    },
    {
      title: '炮（砲）的走法',
      content: (
        <div className="space-y-4">
          <p className="text-lg">炮的走法与車类似，但吃子方式特殊。</p>
          <p className="text-lg">走法：移动时与車相同，沿直线任意格数，不能跳棋。</p>
          <p className="text-lg">吃子：必须跳过一个棋子（无论是己方还是对方的）才能吃掉对方的棋子，俗称"炮翻山"。</p>
        </div>
      )
    },
    {
      title: '兵（卒）的走法',
      content: (
        <div className="space-y-4">
          <p className="text-lg">兵（卒）只能前进，不能后退。</p>
          <p className="text-lg">过河前：每次只能向前走一格，不能左右走。</p>
          <p className="text-lg">过河后：可以向前、向左或向右走一格，仍不能后退。</p>
        </div>
      )
    },
    {
      title: '基本规则与胜负',
      content: (
        <div className="space-y-4">
          <p className="text-lg font-bold text-amber-800">胜负判定：</p>
          <ul className="list-disc list-inside text-lg space-y-2 ml-4">
            <li>将死对方的帅（将）即获胜</li>
            <li>对方无子可走时获胜</li>
            <li>对方主动认输</li>
          </ul>
          <p className="text-lg font-bold text-amber-800 mt-4">其他规则：</p>
          <ul className="list-disc list-inside text-lg space-y-2 ml-4">
            <li>红方先行</li>
            <li>双方轮流走棋</li>
            <li>被"将军"时必须应将</li>
            <li>不能送吃帅（将）</li>
          </ul>
        </div>
      )
    }
  ];
  
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回主菜单
          </button>
          <div className="flex items-center gap-2 text-amber-700">
            <BookOpen className="w-6 h-6" />
            <span className="text-xl font-bold">规则讲解</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[500px]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-2">
              {pages[currentPage].title}
            </h2>
            <div className="flex justify-center gap-2 mt-4">
              {pages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    idx === currentPage ? 'bg-amber-600' : 'bg-amber-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-gray-700 leading-relaxed">
            {pages[currentPage].content}
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
              ${currentPage === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            上一页
          </button>
          
          <div className="text-amber-700 font-semibold py-3">
            {currentPage + 1} / {pages.length}
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
              ${currentPage === pages.length - 1 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
          >
            下一页
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rules;
