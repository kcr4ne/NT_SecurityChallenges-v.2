"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

interface ActiveUserAvatarProps {
  uid: string
  username: string
  initialPhotoURL?: string
  className?: string
}

export function ActiveUserAvatar({ uid, username, initialPhotoURL, className }: ActiveUserAvatarProps) {
  const [photoURL, setPhotoURL] = useState(initialPhotoURL)

  useEffect(() => {
    if (!uid) return

    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, "users", uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const userData = userSnap.data()
          if (userData.photoURL) {
            setPhotoURL(userData.photoURL)
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()
  }, [uid])

  return (
    <Avatar className={className}>
      <AvatarImage src={photoURL || "/placeholder.svg"} alt={username} />
      <AvatarFallback className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs font-semibold">
        {username?.charAt(0)?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  )
}
