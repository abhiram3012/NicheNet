import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Crown } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AnswerQuestionDialog from '@/components/AnswerQuestionDialog';

interface Answer {
  id: string;
  content: string;
  author: string;
  timePosted: string;
}

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    author: string;
    isCreator?: boolean;
    answersCount: number;
    timePosted: string;
    answers: Answer[];
  };
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { hubId } = useParams();
  const [showAnswers, setShowAnswers] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Answer[]>(question.answers);

  const fetchAnswers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/questions/${question.id}`);
      if (!res.ok) throw new Error("Failed to fetch answers");
      const data = await res.json();
      setAllAnswers(data.answers);
      setShowAnswers(true);
      console.log('Fetched answers:', data.answers);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card
      className={`bg-gray-800 hover:shadow-md transition-shadow border border-gray-700 ${
        question.isCreator ? 'ring-2 ring-yellow-500/60 border-yellow-500/50' : ''
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium ${
                    question.isCreator ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                >
                  {question.author}
                </span>
                {question.isCreator && (
                  <Badge className="bg-yellow-900/30 text-yellow-300 text-xs px-2 py-1 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Creator
                  </Badge>
                )}
              </div>
              <span>•</span>
              <span>{question.timePosted}</span>
            </div>
            <Link to={`/hub/${hubId}/question/${question.id}`}>
              <CardTitle className="text-lg text-white hover:text-purple-400 cursor-pointer">
                {question.title}
              </CardTitle>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-300 mb-4">{question.content}</p>

        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300"
            onClick={() => setShowAnswers(!showAnswers)}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{question.answersCount} answers</span>
          </Button>

          <AnswerQuestionDialog
            questionId={question.id}
            questionTitle={question.title}
            onAnswerPosted={fetchAnswers}
          >
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 hover:bg-gray-700">
              Answer
            </Button>
          </AnswerQuestionDialog>
        </div>

        {showAnswers && (
          <div className="border-t pt-4 border-gray-700 space-y-4">
            <h4 className="font-medium text-white">Answers</h4>
            {allAnswers.map((answer) => (
              <div key={answer.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span className="font-medium text-gray-200">{answer.author}</span>
                      <span>•</span>
                      <span>{answer.timePosted}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{answer.content}</p>
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
