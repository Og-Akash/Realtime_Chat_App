import { MessageSquare } from 'lucide-react'
import React from 'react'

const NoUserSelected = () => {
  return (
    <div className="w-full h-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-3">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="size-12 text-accent p-2" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  )
}

export default NoUserSelected
