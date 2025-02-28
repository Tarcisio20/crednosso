"use client"

export const Loading = () => {
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"  >
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"  ></div>
  </div>
}