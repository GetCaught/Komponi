'use client'

import { InfluencerProfile } from '@/lib/supabase'
import Link from 'next/link'

interface InfluencerCardProps {
  influencer: InfluencerProfile
  showActions?: boolean
  onContact?: (influencerId: string) => void
}

export default function InfluencerCard({ 
  influencer, 
  showActions = true, 
  onContact 
}: InfluencerCardProps) {
  const formatNumber = (num?: number) => {
    if (!num) return 'N/A'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            {influencer.avatar_url ? (
              <img
                src={influencer.avatar_url}
                alt={influencer.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-indigo-600">
                {influencer.full_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {influencer.full_name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {influencer.location || 'Location not specified'}
          </p>
          
          {influencer.categories && influencer.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {influencer.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                >
                  {category}
                </span>
              ))}
              {influencer.categories.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  +{influencer.categories.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {influencer.bio && (
        <p className="text-gray-700 mb-4 line-clamp-2">
          {influencer.bio}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Followers</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatNumber(influencer.followers_count)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Engagement</p>
          <p className="text-lg font-semibold text-green-600">
            {influencer.engagement_rate ? `${influencer.engagement_rate}%` : 'N/A'}
          </p>
        </div>
      </div>

      {influencer.social_media_handles && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 mb-2">Social Media</p>
          <div className="flex space-x-3">
            {influencer.social_media_handles.instagram && (
              <a
                href={`https://instagram.com/${influencer.social_media_handles.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700"
              >
                Instagram
              </a>
            )}
            {influencer.social_media_handles.tiktok && (
              <a
                href={`https://tiktok.com/@${influencer.social_media_handles.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700"
              >
                TikTok
              </a>
            )}
            {influencer.social_media_handles.youtube && (
              <a
                href={`https://youtube.com/${influencer.social_media_handles.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700"
              >
                YouTube
              </a>
            )}
            {influencer.social_media_handles.twitter && (
              <a
                href={`https://twitter.com/${influencer.social_media_handles.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      )}

      {showActions && (
        <div className="flex justify-between items-center">
          <Link
            href={`/influencers/${influencer.id}`}
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View Profile
          </Link>
          {onContact && (
            <button
              onClick={() => onContact(influencer.id)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Contact
            </button>
          )}
        </div>
      )}
    </div>
  )
} 