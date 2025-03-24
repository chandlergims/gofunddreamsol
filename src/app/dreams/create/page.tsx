'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function CreateDreamPage() {
  const router = useRouter();
  const { isConnected, address, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    telegram: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [pageState, setPageState] = useState<'loading' | 'not-connected' | 'form'>('loading');

  // Use effect to determine the page state after component mounts
  useEffect(() => {
    // Always show loading first
    if (authLoading) {
      setPageState('loading');
    } else if (!isConnected) {
      setPageState('not-connected');
    } else {
      setPageState('form');
    }
  }, [isConnected, authLoading]);

  // Always render loading state first
  if (pageState === 'loading') {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="mx-auto w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not connected
  if (pageState === 'not-connected') {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="bg-red-50 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V6a3 3 0 00-3-3H6a3 3 0 00-3 3v6a3 3 0 003 3h6a3 3 0 003-3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-6">You need to connect your wallet to create a dream.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full inline-block">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.fundingGoal || !formData.telegram || !imageFile) {
        throw new Error('Please fill in all required fields and upload an image');
      }

      // Parse funding goal as number
      const fundingGoal = parseFloat(formData.fundingGoal);
      if (isNaN(fundingGoal) || fundingGoal <= 0) {
        throw new Error('Funding goal must be a positive number');
      }

      // Upload image if provided
      let imageUrl = '';
      if (imageFile) {
        setIsUploading(true);
        
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          const data = await uploadResponse.json();
          throw new Error(data.error || 'Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
        setIsUploading(false);
      }

      // Submit to API
      console.log('Submitting dream with telegram:', formData.telegram);
      const dreamData = {
        ...formData,
        fundingGoal,
        creator: address,
        imageUrl,
        telegram: formData.telegram,
      };
      console.log('Full dream data being sent:', dreamData);
      
      const response = await fetch('/api/dreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dreamData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create dream');
      }

      // Redirect to home page on success
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-700 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1 font-press-start-2p">Create New Dream</h1>
              <p className="text-gray-500 text-sm">The platform where you have the power to bring someone's dream to life</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-2 font-press-start-2p">
                  Dream Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter a title for your dream"
                  required
                />
              </div>

              <div>
                <label htmlFor="fundingGoal" className="block text-xs font-medium text-gray-700 mb-2 font-press-start-2p">
                  Funding Goal (BSC) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="fundingGoal"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-2 font-press-start-2p">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe your dream in detail - what are you trying to achieve? Why is it important? How will the funds be used?"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="telegram" className="block text-xs font-medium text-gray-700 mb-2 font-press-start-2p">
                Telegram Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="@yourusername"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="image" className="block text-xs font-medium text-gray-700 mb-2 font-press-start-2p">
                Dream Image <span className="text-red-500">*</span>
              </label>
              
              <div className="mt-2 flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-shrink-0 h-24 w-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex flex-col">
                  <div className="flex items-center mb-2">
                    <label 
                      htmlFor="image-upload" 
                      className="relative cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg border border-blue-100 font-medium text-sm hover:bg-blue-100 transition-colors focus-within:outline-none"
                    >
                      <span>Choose image</span>
                      <input 
                        id="image-upload" 
                        name="image-upload" 
                        type="file" 
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    {imageFile && (
                      <span className="ml-3 text-sm text-gray-600">{imageFile.name}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF or WebP up to 5MB. A high-quality image will help your dream stand out.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-8">
              <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center">
                <Link
                  href="/"
                  className="bg-gray-100 text-gray-800 px-5 py-3 rounded-lg mt-3 md:mt-0 hover:bg-gray-200 transition-colors border border-gray-200 text-center md:text-left font-medium font-press-start-2p text-xs"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className={`bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-press-start-2p text-xs flex items-center justify-center ${
                    (isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Dream
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
