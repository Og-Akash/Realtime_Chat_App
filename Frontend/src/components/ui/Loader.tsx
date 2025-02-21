const Loader = () => {
  return (
    <div className='h-screen flex flex-col gap-2 items-center justify-center'>
      <span className="loading loading-spinner loading-xl"></span>
      <span className="text-xl">Loading</span>
    </div>
  )
}

export default Loader
