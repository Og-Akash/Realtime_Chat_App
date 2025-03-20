import MessageIcon from "../icons/Message";

const NoUserSelected = () => {
  return (
    <div className="hidden w-full h-full md:flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-3">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-30 rounded-2xl flex items-center
             justify-center animate-bounce"
            >
              <MessageIcon />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-4xl text-accent font-bold">Welcome to LumeChat</h2>
        <p className="text-base-content/60">
          Design And Created By <b className="text-white text-lg">💓 Akash Ghosh</b>
        </p>
      </div>
    </div>
  );
};

export default NoUserSelected;
