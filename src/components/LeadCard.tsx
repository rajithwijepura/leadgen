import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronDown, ChevronUp, ExternalLink, 
  MessageSquare, Heart, Award, User
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

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(comment_post_date), { addSuffix: true });

  return (
    <div className={`p-4 transition-all duration-200 ${isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {user.profile_pic_url ? (
            <img
              src={user.profile_pic_url}
              alt={user.username || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={24} className="text-gray-500" />
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center mb-1">
            <h3 className="font-medium text-gray-900">{user.full_name || user.username}</h3>
            {user.is_verified && (
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                Verified
              </span>
            )}
            <span className="ml-2 text-sm text-gray-500">@{user.username}</span>
          </div>
          
          <p className="text-gray-700">{comment_text}</p>
          
          <div className="mt-2 flex items-center text-sm text-gray-500 gap-4">
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
              lead_potential === 'High' ? 'bg-green-100 text-green-800' :
              lead_potential === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              lead_potential === 'Low' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <Award size={12} className="mr-1" />
              {lead_potential} potential
            </span>
            
            <button
              className="text-blue-600 text-xs font-medium flex items-center"
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
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Lead Analysis</h4>
              
              {analysis_result.reason && (
                <div className="mb-3">
                  <span className="text-gray-700 font-medium">Reason: </span>
                  <span className="text-gray-600">{analysis_result.reason}</span>
                </div>
              )}
              
              {analysis_result.about_user && analysis_result.about_user.length > 0 && (
                <div>
                  <h5 className="text-gray-700 font-medium mb-1">User Profile</h5>
                  <ul className="list-disc list-inside text-gray-600 pl-1 space-y-1">
                    {analysis_result.about_user[0].location && (
                      <li><span className="font-medium">Location:</span> {analysis_result.about_user[0].location}</li>
                    )}
                    {analysis_result.about_user[0].psychology_profile && (
                      <li><span className="font-medium">Psychology:</span> {analysis_result.about_user[0].psychology_profile}</li>
                    )}
                    {analysis_result.about_user[0].estimated_spend && (
                      <li><span className="font-medium">Estimated spend:</span> {analysis_result.about_user[0].estimated_spend}</li>
                    )}
                    {analysis_result.about_user[0].next_step && (
                      <li><span className="font-medium">Recommended action:</span> {analysis_result.about_user[0].next_step}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {child_comment_array.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Replies</h4>
              
              {child_comment_array.map((reply: any) => (
                <div key={reply.id} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {reply.user.profile_pic_url ? (
                        <img
                          src={reply.user.profile_pic_url}
                          alt={reply.user.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{reply.user.username}</span>
                        {reply.user.is_verified && (
                          <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{reply.comment_text}</p>
                      <div className="mt-1 text-xs text-gray-500">
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
              className="text-blue-600 text-xs font-medium flex items-center hover:underline"
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
