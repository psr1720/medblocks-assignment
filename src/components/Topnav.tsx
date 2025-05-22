import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Topnav = () => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0 flex items-center mx-1 p-2">
          <Link to="/" className="flex items-center">
            <Heart className="h-7 w-7 text-blue-600" />
            <span className="ml-2 text-[20px] font-bold text-blue-600 ">
              Medblocks
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Topnav;
