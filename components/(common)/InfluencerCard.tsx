'use client'

import { InfluencerProfile } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Users, TrendingUp } from 'lucide-react'

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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      {/* Header with gradient background */}
      <div className="h-24 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 relative">
        <div className="absolute -bottom-6 left-4">
          <div className="w-12 h-12 bg-white rounded-full p-1 shadow-md">
            {influencer.avatar_url ? (
              <Image
                src={influencer.avatar_url}
                alt={influencer.full_name}
                width={40}
                height={40}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-600">
                  {influencer.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        {influencer.categories && influencer.categories.length > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium text-gray-700 rounded-full">
              {influencer.categories[0]}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 pt-8">
        {/* Influencer info */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
            {influencer.full_name}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{influencer.location || 'Location not specified'}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">4.9</span>
              <span className="text-gray-500 ml-1">(247 reviews)</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {influencer.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {influencer.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Users className="w-4 h-4 text-gray-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">{formatNumber(influencer.followers_count)}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">
              {influencer.engagement_rate ? `${influencer.engagement_rate}%` : 'N/A'}
            </div>
            <div className="text-xs text-gray-500">Engagement</div>
          </div>
        </div>

        {/* Social Media Icons */}
        {influencer.social_media_handles && (
          <div className="flex justify-center space-x-3 mb-4">
            {influencer.social_media_handles.instagram && (
              <a
                href={`https://instagram.com/${influencer.social_media_handles.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <span className="text-xs font-bold">IG</span>
              </a>
            )}
            {influencer.social_media_handles.tiktok && (
              <a
                href={`https://tiktok.com/@${influencer.social_media_handles.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <span className="text-xs font-bold">TT</span>
              </a>
            )}
            {influencer.social_media_handles.youtube && (
              <a
                href={`https://youtube.com/${influencer.social_media_handles.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <span className="text-xs font-bold">YT</span>
              </a>
            )}
            {influencer.social_media_handles.twitter && (
              <a
                href={`https://twitter.com/${influencer.social_media_handles.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <span className="text-xs font-bold">TW</span>
              </a>
            )}
          </div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="flex gap-2">
            <Link
              href={`/influencers/${influencer.id}`}
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-md transition-colors"
            >
              View Profile
            </Link>
            {onContact && (
              <button
                onClick={() => onContact(influencer.id)}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
              >
                Contact
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}