"use client"

import { Heart, MessageCircle, Share, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function CommunityPage() {
  const posts = [
    {
      id: 1,
      user: {
        name: "Alex Chen",
        location: "Chiang Mai, Thailand",
        avatar: "AC",
      },
      image: "/placeholder.svg?height=400&width=400",
      caption:
        "Perfect morning hike in the Thai mountains wearing my new Calm Outdoors shorts! The fabric is so breathable 🏔️ #CalmOutdoors #ThaiMountains",
      likes: 127,
      comments: 23,
      timeAgo: "2 hours ago",
      product: "Outdoor Shorts - Forest Green",
    },
    {
      id: 2,
      user: {
        name: "Sarah Kim",
        location: "Bangkok, Thailand",
        avatar: "SK",
      },
      image: "/placeholder.svg?height=400&width=400",
      caption:
        "City adventures call for comfortable gear! These shorts from @calmoutdoors are perfect for exploring Bangkok's markets 🛍️",
      likes: 89,
      comments: 15,
      timeAgo: "5 hours ago",
      product: "Urban Explorer Shorts",
    },
    {
      id: 3,
      user: {
        name: "Mike Torres",
        location: "Phuket, Thailand",
        avatar: "MT",
      },
      image: "/placeholder.svg?height=400&width=400",
      caption:
        "Beach day vibes! Love how these dry so quickly after a swim. Thai-made quality at its finest 🏖️ #BeachLife #CalmOutdoors",
      likes: 156,
      comments: 31,
      timeAgo: "1 day ago",
      product: "Quick-Dry Beach Shorts",
    },
    {
      id: 4,
      user: {
        name: "Emma Wilson",
        location: "Krabi, Thailand",
        avatar: "EW",
      },
      image: "/placeholder.svg?height=400&width=400",
      caption:
        "Rock climbing session in Krabi! These shorts give me the perfect range of motion. Can't wait for my next Calm Outdoors shipment! 🧗‍♀️",
      likes: 203,
      comments: 42,
      timeAgo: "2 days ago",
      product: "Climbing Shorts - Charcoal",
    },
    {
      id: 5,
      user: {
        name: "James Park",
        location: "Koh Samui, Thailand",
        avatar: "JP",
      },
      image: "/placeholder.svg?height=400&width=400",
      caption:
        "Island hopping adventures! The scheduled delivery system is genius - I always know when my next gear is coming 🏝️",
      likes: 94,
      comments: 18,
      timeAgo: "3 days ago",
      product: "Island Explorer Shorts",
    },
    {
      id: 6,
      user: {
        name: "Lisa Chang",
        location: "Pai, Thailand",
        avatar: "LC",
      },
      image: "/placeholder.svg?height=400&width=400",
      caption:
        "Sunset yoga session in Pai. These shorts are so comfortable for all my outdoor activities! 🧘‍♀️✨ #YogaLife #ThaiSunset",
      likes: 178,
      comments: 27,
      timeAgo: "4 days ago",
      product: "Yoga Shorts - Sage Green",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Community</h1>
          <p className="text-gray-600 text-center text-sm mt-1">See how our community wears Calm Outdoors</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-4">
        <div className="px-4 flex justify-center space-x-8 text-center">
          <div>
            <div className="text-2xl font-bold">2.3K</div>
            <div className="text-xs opacity-90">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold">15K</div>
            <div className="text-xs opacity-90">Community</div>
          </div>
          <div>
            <div className="text-2xl font-bold">47</div>
            <div className="text-xs opacity-90">Countries</div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-md mx-auto">
        {posts.map((post) => (
          <Card key={post.id} className="mb-4 mx-4 overflow-hidden border-0 shadow-sm">
            <CardContent className="p-0">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {post.user.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{post.user.name}</div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {post.user.location}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{post.timeAgo}</div>
              </div>

              {/* Post Image */}
              <div className="relative">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Community post"
                  className="w-full h-80 object-cover bg-gradient-to-br from-green-400 to-green-600"
                />
                {/* Product Tag */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                  {post.product}
                </div>
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <Share className="w-5 h-5 text-gray-600" />
                    </Button>
                  </div>
                </div>

                {/* Likes and Comments */}
                <div className="text-sm text-gray-900 font-semibold mb-2">{post.likes} likes</div>

                {/* Caption */}
                <div className="text-sm text-gray-900">
                  <span className="font-semibold">{post.user.name}</span> {post.caption}
                </div>

                {/* View Comments */}
                {post.comments > 0 && (
                  <button className="text-sm text-gray-500 mt-2">View all {post.comments} comments</button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-8 mx-4 mb-8">
        <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white border-0">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Join Our Community</h3>
            <p className="text-sm opacity-90 mb-4">Share your adventures and get featured on our community page</p>
            <div className="space-y-2">
              <Button className="w-full bg-white text-green-700 hover:bg-gray-100">Share Your Story</Button>
              <Link href="/">
                <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                  Shop Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
