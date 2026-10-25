import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getReports } from "@/data/articles";
import { User, Shield, Upload, FileText, CheckCircle2, Clock, ArrowRight, Award } from "lucide-react";

export default function ContributorDashboard() {
  const { user, login } = useAuth();
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports().then((all) => {
      // Filter reports by current user if applicable
      if (user?.id) {
        setUserReports(all.filter((r) => r.user_id === user.id || r.userId === user.id || r.submitter_name === user.name));
      } else {
        setUserReports(all);
      }
      setLoading(false);
    });
  }, [user]);

  const handleDemoLogin = () => {
    login({
      id: "demo-contributor",
      name: "Aarav Sharma",
      email: "aarav.reporter@intellus.in",
      role: "CONTRIBUTOR",
      contributorId: "CONT-8492",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-100 min-h-[75vh]">
      {/* Contributor Profile Card */}
      <div className="bg-[#090c0e] border border-[#161c22] rounded-2xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-2xl bg-[#38ba9b] text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-[#38ba9b]/20">
            {user?.name ? user.name[0].toUpperCase() : "C"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                {user?.name || "Community Contributor"}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#38ba9b]/10 text-[#38ba9b] border border-[#38ba9b]/30 text-[10px] font-bold">
                VERIFIED CONTRIBUTOR
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {user?.email || "contributor@intellus.in"}
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              ID: <span className="text-[#38ba9b] font-bold">{user?.contributorId || "CONT-8492"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Link
            to="/submit-report"
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-full bg-[#38ba9b] text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-[#2ea287] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#38ba9b]/20"
          >
            <Upload className="w-4 h-4" />
            <span>Submit Story Lead</span>
          </Link>
          {!user && (
            <button
              onClick={handleDemoLogin}
              className="px-4 py-2.5 rounded-full border border-slate-700 text-xs font-bold text-white hover:border-[#38ba9b]"
            >
              Sign In Demo Contributor
            </button>
          )}
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#090c0e] border border-[#161c22] rounded-xl p-5 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Submissions</div>
          <div className="text-3xl font-black text-white">{userReports.length}</div>
          <p className="text-[10px] text-slate-500">Total leads sent to the Intellus newsroom</p>
        </div>

        <div className="bg-[#090c0e] border border-[#161c22] rounded-xl p-5 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Credibility Score</div>
          <div className="text-3xl font-black text-[#38ba9b]">98%</div>
          <p className="text-[10px] text-slate-500">Based on verified document citations</p>
        </div>

        <div className="bg-[#090c0e] border border-[#161c22] rounded-xl p-5 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contributor Tier</div>
          <div className="text-3xl font-black text-amber-400 flex items-center">
            <span>Tier 1</span>
            <Award className="w-6 h-6 ml-2 text-amber-400" />
          </div>
          <p className="text-[10px] text-slate-500">Direct desk review access enabled</p>
        </div>
      </div>

      {/* My Submissions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black uppercase text-white tracking-tight">
            Your News Submissions & Leads
          </h2>
          <Link to="/submit-report" className="text-xs text-[#38ba9b] font-bold hover:underline flex items-center">
            <span>New Submission</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {userReports.length === 0 ? (
          <div className="bg-[#090c0e] border border-[#161c22] rounded-2xl p-10 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-white">No submissions recorded yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't transmitted any news leads yet. Start by filing your first citizen report.
            </p>
            <Link
              to="/submit-report"
              className="inline-block px-5 py-2.5 rounded-full bg-[#38ba9b] text-slate-950 font-bold text-xs uppercase"
            >
              Submit News Lead
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {userReports.map((rep) => (
              <div
                key={rep.id}
                className="bg-[#090c0e] border border-[#161c22] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-[#38ba9b] uppercase font-bold mb-1">
                    <span>{rep.category || "General"}</span>
                    <span>•</span>
                    <span className="text-slate-500">{new Date(rep.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm font-bold text-white">{rep.title}</div>
                  <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{rep.description}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold font-mono">
                    {rep.status || "PENDING"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
