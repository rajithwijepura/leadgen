import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronDown, ChevronUp, ExternalLink, 
  MessageSquare, Heart, Award, Mail,
  Instagram
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
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5] flex items-center justify-center">
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
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <h4 className="font-medium text-white text-lg mb-2">Lead Analysis</h4>
              
              {analysis_result.reason && (
                <div className="mb-3">
                  <span className="text-purple-300 font-medium">Reason: </span>
                  <span className="text-white">{analysis_result.reason}</span>
                </div>
              )}
              
              {analysis_result.about_user && analysis_result.about_user.length > 0 && (
                <div>
                  <h5 className="text-white font-medium mb-2">User Profile</h5>
                  <ul className="space-y-2 text-white">
                    {analysis_result.about_user[0].location && (
                      <li className="flex items-center gap-2">
                        <span className="font-medium text-white">Location:</span>
                        {analysis_result.about_user[0].location}
                      </li>
                    )}
                    {analysis_result.about_user[0].psychology_profile && (
                      <li className="flex items-center gap-2">
                        <span className="font-medium text-white">Psychology:</span>
                        {analysis_result.about_user[0].psychology_profile}
                      </li>
                    )}
                    {analysis_result.about_user[0].estimated_spend && (
                      <li className="flex items-center gap-2">
                        <span className="font-medium text-white">Estimated spend:</span>
                        {analysis_result.about_user[0].estimated_spend}
                      </li>
                    )}
                    {analysis_result.about_user[0].next_step && (
                      <li className="flex items-center gap-2">
                        <span className="font-medium text-white">Recommended action:</span>
                        {analysis_result.about_user[0].next_step}
                      </li>
                    )}
                  </ul>
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