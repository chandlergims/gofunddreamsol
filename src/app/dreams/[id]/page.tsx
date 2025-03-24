'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

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

export default function DreamPage() {
  const router = useRouter();
  const params = useParams();
  const { isConnected, address } = useAuth();
  const [dream, setDream] = useState<Dream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  
  // Get the dream ID from the params
  const dreamId = params?.id as string;

  useEffect(() => {
    const fetchDream = async () => {
      try {
        const response = await fetch(`/api/dreams/${dreamId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Dream not found');
          }
          throw new Error('Failed to fetch dream');
        }
        
        const data = await response.json();
        setDream(data.dream);
        
        // Check if current user is the creator
        if (isConnected && address && data.dream.creator) {
          setIsOwner(address.toLowerCase() === data.dream.creator.toLowerCase());
        }
      } catch (err: any) {
        console.error('Error fetching dream:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    if (dreamId) {
      fetchDream();
    }
  }, [dreamId, isConnected, address]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this dream?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/dreams/${dreamId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete dream');
      }
      
      router.push('/');
    } catch (err: any) {
      console.error('Error deleting dream:', err);
      setError(err.message || 'Failed to delete dream');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-8"></div>
              
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="w-full md:w-1/2">
                  <div className="h-72 bg-gray-200 rounded-xl mb-6"></div>
                </div>
                
                <div className="w-full md:w-1/2 bg-white border border-gray-100 rounded-xl shadow-md p-6">
                  <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-4/6 mb-6"></div>
                  <div className="h-3 bg-gray-200 rounded-full w-full mb-6"></div>
                  <div className="h-20 bg-gray-200 rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dream) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-50 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || 'Dream Not Found'}</h2>
            <p className="text-gray-600 mb-6">We couldn't find the dream you're looking for.</p>
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block shadow-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dreams
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{dream.title}</h1>
          <div className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-100">
            {dream.status.charAt(0).toUpperCase() + dream.status.slice(1)}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              {dream.imageUrl ? (
                <img 
                  src={dream.imageUrl} 
                  alt={dream.title} 
                  className="w-full h-full object-cover"
                  style={{ minHeight: '300px' }}
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-blue-500 text-xl font-medium">GoFundDream</span>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/2 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">About this Dream</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Created <span className="font-medium ml-1">{new Date(dream.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{dream.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-800">Funding Progress</span>
                  <span className="text-sm font-medium text-blue-600">
                    {dream.currentFunding} / {dream.fundingGoal} BSC
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-1 overflow-hidden shadow-inner">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${Math.min(100, (dream.currentFunding / dream.fundingGoal) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-right text-gray-500">
                  {Math.round((dream.currentFunding / dream.fundingGoal) * 100)}% funded
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Creator Wallet Address</h3>
                  <p className="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded border border-gray-200">
                    {dream.creator}
                  </p>
                </div>
                
                {dream.telegram && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Contact on Telegram</h3>
                    <div className="flex items-center bg-white p-2 rounded border border-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.952z" />
                      </svg>
                      <a 
                        href={`https://t.me/${dream.telegram.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {dream.telegram}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
          
        {isOwner && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium text-sm"
            >
              Delete Dream
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
