import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, MessageSquare, Crown } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AnswerQuestionDialog from '@/components/AnswerQuestionDialog';

interface Answer {
  id: string;
  content: string;
  author: string;
  upvotes: number;
  timePosted: string;
}

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    author: string;
    isCreator?: boolean;
    upvotes: number;
    answersCount: number;
    timePosted: string;
    answers: Answer[];
  };
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    const { hubId } = useParams();
  const [showAnswers, setShowAnswers] = useState(false);
  const {
    id,
    title,
    content,
    author,
    isCreator = false,
    upvotes,
    answersCount,
    timePosted,
    answers
  } = question;
  const [allAnswers, setAllAnswers] = useState<Answer[]>(question.answers);

    const fetchAnswers = async () => {
    try {
        const res = await fetch(`http://localhost:5000/api/questions/${id}`);
        if (!res.ok) throw new Error("Failed to fetch answers");
        const data = await res.json();
        setAllAnswers(data.answers);
    } catch (err) {
        console.error(err);
    }
    };

  // Add this function inside QuestionCard component (above return)
    const postAnswer = async (questionId: string, content: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to post answer');
    }
    };

  return (
    <Card className={`bg-white hover:shadow-md transition-shadow ${isCreator ? 'ring-2 ring-yellow-200 border-yellow-300' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isCreator ? 'text-yellow-700' : ''}`}>
                  {author}
                </span>
                {isCreator && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Creator
                  </Badge>
                )}
              </div>
              <span>•</span>
              <span>{timePosted}</span>
            </div>
            <Link to={`/hub/${hubId}/question/${id}`}>
              <CardTitle className="text-lg hover:text-purple-600 cursor-pointer">
                {title}
              </CardTitle>
            </Link>
          </div>
          <div className="flex flex-col items-center space-y-1 min-w-[60px]">
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-orange-100">
              <ChevronUp className="w-4 h-4 text-orange-600" />
            </Button>
            <span className="text-sm font-medium text-gray-700">{upvotes}</span>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-blue-100">
              <ChevronDown className="w-4 h-4 text-blue-600" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 mb-4">{content}</p>

        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowAnswers(!showAnswers)}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{answersCount} answers</span>
          </Button>
          
          <AnswerQuestionDialog
            questionId={question.id}
            questionTitle={question.title}
            onAnswerPosted={fetchAnswers}
            >
            <Button variant="outline" size="sm">
                Answer
            </Button>
            </AnswerQuestionDialog>
        </div>

        {showAnswers && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-gray-800">Answers</h4>
            {allAnswers.map((answer) => (
              <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center space-y-1 min-w-[40px]">
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6 hover:bg-orange-100">
                      <ChevronUp className="w-3 h-3 text-orange-600" />
                    </Button>
                    <span className="text-xs font-medium text-gray-600">{answer.upvotes}</span>
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6 hover:bg-blue-100">
                      <ChevronDown className="w-3 h-3 text-blue-600" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="font-medium">{answer.author}</span>
                      <span>•</span>
                      <span>{answer.timePosted}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{answer.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
