import { useNavigate } from "react-router-dom";

export default function Card({ title, icon, to }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(to)}
      className="cursor-pointer group 
                 bg-white/5 backdrop-blur-xl border border-indigo-800/40 
                 rounded-3xl p-12 flex flex-col items-center justify-center gap-6
                 hover:border-indigo-400/60 hover:shadow-[0_0_40px_rgba(111,57,255,0.25)]
                 hover:bg-white/3 border-white/10 hover:bg-white/6 hover:border-indigo-400/40
                 transition-all duration-300 ease-out"
    >
      <div className="p-6 bg-indigo-500/10 rounded-2xl group-hover:bg-indigo-500/20 transition-all duration-300">
        {icon}
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-white group-hover:text-indigo-300 transition-colors duration-300">
        {title}
      </h2>
    </div>
  );
}
