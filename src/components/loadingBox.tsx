
export default function LoadingBox() {
  return (
    <div className="fixed top-0 left-0 z-50 z-[9999] w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-700"></div>
        </div>
      </div>
  )
}
