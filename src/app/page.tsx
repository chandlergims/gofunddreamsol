'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import GrantsSection from '@/components/GrantsSection';

interface Dream {
  _id: string;
  title: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  creator: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
  telegram?: string;
}

export default function Home() {
  const { isConnected, address, connectWallet } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  const [activeDreams, setActiveDreams] = useState<Dream[]>([]);
  const [completedDreams, setCompletedDreams] = useState<Dream[]>([]);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  
  // Stats from the database
  const [stats, setStats] = useState({
    totalCount: 0,
    completedCount: 0,
    totalFunding: 0,
    uniqueCreatorsCount: 0
  });

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        // Fetch dreams with sorting parameters
        const response = await fetch(`/api/dreams?sortBy=${sortBy}&order=${sortOrder}&limit=9`);
        const data = await response.json();
        
        // Get dreams and stats from response
        const allDreams = data.dreams || [];
        setDreams(allDreams);
        
        // Set stats from API response
        if (data.stats) {
          setStats(data.stats);
        }
        
        // Active dreams: status is 'active' or 'funded'
        setActiveDreams(allDreams.filter((dream: Dream) => 
          dream.status === 'active' || dream.status === 'funded'
        ));
        
        // Completed dreams: status is 'completed'
        setCompletedDreams(allDreams.filter((dream: Dream) => 
          dream.status === 'completed'
        ));
      } catch (error) {
        console.error('Error fetching dreams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDreams();
  }, [sortBy, sortOrder]); // Re-fetch when sort parameters change
  
  // Handle filter changes
  const handleSortChange = (newSortBy: string, newOrder: string) => {
    // Don't do anything if the sort hasn't changed
    if (newSortBy === sortBy && newOrder === sortOrder) return;
    
    setIsFiltering(true);
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    
    // Simulate a quick filter without full page reload
    setTimeout(() => {
      setIsFiltering(false);
    }, 500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* Left Column - Grants Section */}
        <div className="w-1/5 p-4">
          <GrantsSection />
        </div>
        
        {/* Main Content */}
        <div className="w-4/5 px-6 py-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 font-press-start-2p">梦想众筹</h1>
            <p className="text-gray-500 text-sm">一个让您有能力实现他人梦想的平台</p>
          </div>
          
          <button 
            onClick={isConnected ? () => window.location.href = '/dreams/create' : connectWallet}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-medium py-2 px-5 rounded-lg transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-press-start-2p text-[10px]">{isConnected ? '创建梦想' : '连接钱包'}</span>
          </button>
        </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalCount}</div>
                <div className="text-sm text-gray-600">梦想总数</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.completedCount}</div>
                <div className="text-sm text-gray-600">已完成梦想</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {stats.totalFunding}
                </div>
                <div className="text-sm text-gray-600">BSC总资金</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {stats.uniqueCreatorsCount}
                </div>
                <div className="text-sm text-gray-600">独立创作者</div>
              </div>
            </div>
            
            {isLoading ? (
          // Loading placeholders
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded-full w-1/3"></div>
              </div>
            ))}
          </div>
        ) : dreams.length > 0 ? (
          <>
            {/* New Dreams Section */}
            <div className="mb-12">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                  <h2 className="text-xl font-bold text-gray-800 font-press-start-2p">新梦想</h2>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-wrap gap-2">
                  <div className="text-sm font-medium text-gray-700 mr-2 flex items-center">筛选条件：</div>
                  <button 
                    onClick={() => handleSortChange('createdAt', 'desc')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                      sortBy === 'createdAt' && sortOrder === 'desc' 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    最新优先
                  </button>
                  <button 
                    onClick={() => handleSortChange('createdAt', 'asc')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                      sortBy === 'createdAt' && sortOrder === 'asc' 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    最早优先
                  </button>
                  <button 
                    onClick={() => handleSortChange('fundingGoal', 'desc')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                      sortBy === 'fundingGoal' && sortOrder === 'desc' 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    BSC：从高到低
                  </button>
                  <button 
                    onClick={() => handleSortChange('fundingGoal', 'asc')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                      sortBy === 'fundingGoal' && sortOrder === 'asc' 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    BSC：从低到高
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative min-h-[200px]">
                {isFiltering && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
                {activeDreams.length > 0 ? (
                  activeDreams.map((dream) => (
                    <div 
                      key={dream._id} 
                      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow flex flex-col relative"
                    >
                      {/* Share button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const creatorShort = `${dream.creator.substring(0, 6)}...${dream.creator.substring(dream.creator.length - 4)}`;
                          const tweetText = `我刚刚为${creatorShort}的梦想提供了资金！\n\n查看详情:`;
                          // Use absolute URL for production compatibility
                          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
                          const tweetUrl = `${baseUrl}/dreams/${dream._id}`;
                          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(tweetUrl)}`, '_blank');
                        }}
                        className="absolute top-3 right-3 bg-blue-50 hover:bg-blue-100 text-blue-600 p-1.5 rounded-full transition-colors z-10"
                        aria-label="Share on Twitter"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      
                      <Link 
                        href={`/dreams/${dream._id}`}
                        className="flex flex-col flex-grow"
                      >
                        <div className="flex items-start mb-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4 shadow-sm">
                          {dream.imageUrl ? (
                            <img 
                              src={dream.imageUrl} 
                              alt={dream.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <span className="text-blue-500 text-xs font-medium">BnB</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-md font-semibold text-gray-800 mb-1 line-clamp-1">{dream.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{dream.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-blue-600">
                            {dream.fundingGoal} BSC
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(dream.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-2.5 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-2 rounded-full shadow-inner" 
                            style={{ width: `${Math.min(100, (dream.currentFunding / dream.fundingGoal) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex flex-col space-y-1 mt-2">
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">创建者: </span>
                            {dream.creator.substring(0, 6)}...{dream.creator.substring(dream.creator.length - 4)}
                          </div>
                          {dream.telegram && (
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">电报: </span>
                              <span className="text-blue-600">
                                {dream.telegram}
                              </span>
                            </div>
                          )}
                        </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">暂无活跃梦想</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Completed Dreams Section */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-gray-800 font-press-start-2p">已完成梦想</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedDreams.length > 0 ? (
                  completedDreams.map((dream) => (
                    <div 
                      key={dream._id} 
                      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow flex flex-col relative"
                    >
                      {/* Share button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const creatorShort = `${dream.creator.substring(0, 6)}...${dream.creator.substring(dream.creator.length - 4)}`;
                          const tweetText = `我刚刚为${creatorShort}的梦想提供了资金！\n\n查看详情:`;
                          // Use absolute URL for production compatibility
                          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
                          const tweetUrl = `${baseUrl}/dreams/${dream._id}`;
                          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(tweetUrl)}`, '_blank');
                        }}
                        className="absolute top-3 right-3 bg-blue-50 hover:bg-blue-100 text-blue-600 p-1.5 rounded-full transition-colors z-10"
                        aria-label="Share on Twitter"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      
                      <Link 
                        href={`/dreams/${dream._id}`}
                        className="flex flex-col flex-grow"
                      >
                        <div className="flex items-start mb-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4 shadow-sm">
                          {dream.imageUrl ? (
                            <img 
                              src={dream.imageUrl} 
                              alt={dream.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <span className="text-blue-500 text-xs font-medium">BnB</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-md font-semibold text-gray-800 mb-1 line-clamp-1">{dream.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{dream.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-green-600">
                            {dream.fundingGoal} BSC
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(dream.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-2.5 overflow-hidden">
                          <div 
                            className="bg-green-500 h-2 rounded-full shadow-inner" 
                            style={{ width: `100%` }}
                          ></div>
                        </div>
                        <div className="flex flex-col space-y-1 mt-2">
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">创建者: </span>
                            {dream.creator.substring(0, 6)}...{dream.creator.substring(dream.creator.length - 4)}
                          </div>
                          {dream.telegram && (
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">电报: </span>
                              <span className="text-blue-600">
                                {dream.telegram}
                              </span>
                            </div>
                          )}
                        </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">暂无已完成梦想</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-50 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">暂无梦想</h3>
            <p className="text-sm text-gray-500 mb-4">成为第一个创建梦想的人！</p>
            
            <button 
              onClick={isConnected ? () => window.location.href = '/dreams/create' : connectWallet}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-medium py-2 px-5 rounded-lg transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-press-start-2p text-[10px]">{isConnected ? '创建梦想' : '连接钱包'}</span>
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
