import { PropsWithChildren } from "react";
import { Icons } from "./icons";
import { PlusCircle } from "lucide-react";

export const MockDiscordUI = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-300 w-full mx-w-[1200px] bg-black text-white rounded-lg overflow-hidden shadow-xl">
      {/* server list */}
      <div className="hidden sm:flex w-18 bg-[#202225] py-3 flex-col  items-center">
        <div className="size-12 bg-blue-700 rounded-2xl flex items-center justify-center mb-2 hover:rounded-xl transition-all duratio-200">
          <Icons.discord className="size-3/5 text-white" />
        </div>
        <div className="w-8 h-0.5 bg-black rounded-full my-2" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="size-12 bg-black rounded-3xl flex items-center justify-center hover:rounded-xl transition-all duration-200 hover:bg-blue-700 cursor-not-allowed"
          >
            <span className="text-lg font-semibold text-gray-400">
              {String.fromCharCode(65 + i)}
            </span>
          </div>
        ))}
        <div className="group size-12 bg-black rounded-3xl flex items-center justify-center hover:rounded-xl transition-all duration-200 hover:bg-[#3ba55c] ">
          <PlusCircle className="text-[#3ba55c] group-hover:text-white" />
        </div>
      </div>
      {/* dm list */}
      <div className="hidden md:flex w-60 flex-col bg-[#2f3136] ">
        <div className="px-4 h-16 border-b border-[#202225] flex items-center shadow-sm">
          <div className="w-full bg-[#202225] text-sm rounded px-2 h-8 flex items-center justify-center text-gray-500 cursor-not-allowed">
            Find or start a conversation
          </div>
        </div>
      </div>
    </div>
  );
};
