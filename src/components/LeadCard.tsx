import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronDown, ChevronUp, ExternalLink, 
  MessageSquare, Heart, Award, Mail,
  Instagram, Info, Zap, MessageCircle
} from 'lucide-react';

interface LeadCardProps {
  lead: any;
  isExpanded: boolean;
  onToggle: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, isExpanded, onToggle }) => {
  const {
    comment_text,
    comment_post_date,
    comment_likes,
    user,
    analysis_result,
    lead_potential,
    child_comment_array = []
  } = lead;

  const formattedDate = formatDistanceToNow(new Date(comment_post_date), { addSuffix: true });

  return (
    <div className={`p-6 transition-all duration-200 ${isExpanded ? 'bg-gray-700/30' : 'hover:bg-gray-700/20'}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] via-[#962fbf] to-[#4f5bd5] flex items-center justify-center">
            <Instagram size={24} className="text-white" />
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center mb-1">
            <h3 className="font-medium text-gray-200">{user.full_name || user.username}</h3>
            {user.is_verified && (
              <span className="ml-1 bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
            <span className="ml-2 text-sm text-gray-400">@{user.username}</span>
          </div>
          
          <p className="text-gray-300">{comment_text}</p>
          
          <div className="mt-3 flex items-center text-sm text-gray-400 gap-4">
            <span className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              {lead.child_comments} replies
            </span>
            <span className="flex items-center">
              <Heart size={14} className="mr-1" />
              {comment_likes} likes
            </span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              lead_potential === 'High' ? 'bg-purple-500/20 text-purple-400' :
              lead_potential === 'Medium' ? 'bg-pink-500/20 text-pink-400' :
              lead_potential === 'Low' ? 'bg-rose-500/20 text-rose-400' :
              'bg-gray-600/20 text-gray-400'
            }`}>
              <Award size={12} className="mr-1" />
              {lead_potential} potential
            </span>
            
            <button
              className="text-purple-400 text-xs font-medium flex items-center hover:text-purple-300 transition-colors"
              onClick={onToggle}
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  Show more
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 ml-16 space-y-4 text-sm">
          {analysis_result && (
            <div className="bg-[#0F1117] p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-2xl font-bold text-white">Lead Analysis</h4>
                <span className="bg-purple-900/50 text-purple-300 px-4 py-1 rounded-full text-sm">
                  {lead_potential} potential
                </span>
              </div>

              <div className="space-y-6">
                {analysis_result.reason && (
                  <div className="bg-[#1A1B23] rounded-xl p-4 border-l-4 border-purple-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={20} className="text-purple-400" />
                      <h5 className="text-xl font-semibold text-white">Reason</h5>
                    </div>
                    <p className="text-gray-300">{analysis_result.reason}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-2">Location</h5>
                    <p className="text-gray-400">
                      {analysis_result.about_user?.[0]?.location || 'Not guessable from the username'}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-2">Psychology</h5>
                    <p className="text-gray-400">
                      {analysis_result.about_user?.[0]?.psychology_profile || 'No psychology profile available'}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-lg font-semibold text-white mb-2">Estimated Spend</h5>
                  <p className="text-gray-400">
                    {analysis_result.about_user?.[0]?.estimated_spend || 'No spend estimate available'}
                  </p>
                </div>

                {analysis_result.about_user?.[0]?.next_step && (
                  <div className="bg-[#1A1B23] rounded-xl p-4 border-l-4 border-red-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={20} className="text-red-400" />
                      <h5 className="text-xl font-semibold text-white">Recommended Action</h5>
                    </div>
                    <p className="text-gray-300">{analysis_result.about_user[0].next_step}</p>
                  </div>
                )}

                {analysis_result.about_user?.[0]?.suggested_reply && (
                  <div className="bg-[#1A1B23] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle size={20} className="text-pink-400" />
                      <h5 className="text-xl font-semibold text-white">Suggested Reply</h5>
                    </div>
                    <p className="text-gray-300">{analysis_result.about_user[0].suggested_reply}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-row w-full gap-2">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2E3141] hover:bg-[#37394D] text-white rounded-lg transition-colors">
                    <img src="https://cdn.simpleicons.org/notion/white" alt="Notion" className="w-4 h-4" />
                    Add to Notion
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4A154B] hover:bg-[#611F69] text-white rounded-lg transition-colors">
                    <img src="https://cdn.simpleicons.org/slack/white" alt="Slack" className="w-4 h-4" />
                    Add to Slack
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF7A59] hover:bg-[#FF8F73] text-white rounded-lg transition-colors">
                    <img src="https://cdn.simpleicons.org/hubspot/white" alt="HubSpot" className="w-4 h-4" />
                    Add to HubSpot
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#EA4335] hover:bg-[#FF5145] text-white rounded-lg transition-colors">
                    <Mail size={16} className="text-white" />
                    Send via Email
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {child_comment_array.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-200">Replies</h4>
              
              {child_comment_array.map((reply: any) => (
                <div key={reply.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5] flex items-center justify-center">
                        <Instagram size={16} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-200">{reply.user.username}</span>
                        {reply.user.is_verified && (
                          <span className="ml-1 bg-blue-500/20 text-blue-400 text-xs px-1 py-0.5 rounded-full">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mt-1">{reply.comment_text}</p>
                      <div className="mt-2 text-xs text-gray-400">
                        {formatDistanceToNow(new Date(reply.comment_post_date), { addSuffix: true })} · {reply.comment_likes} likes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-end">
            <a 
              href={`https://instagram.com/p/${lead.insta_post_code}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 text-xs font-medium flex items-center hover:text-purple-300 transition-colors"
            >
              View on Instagram
              <ExternalLink size={12} className="ml-1" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};