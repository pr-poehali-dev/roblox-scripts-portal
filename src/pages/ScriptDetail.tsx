import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API_BASE = 'https://functions.poehali.dev';

interface Script {
  id: number;
  name: string;
  description: string;
  script_content: string;
  category: string;
  game: string;
  rating: string;
  downloads: number;
  verified: boolean;
  author: string;
  created_at: string;
  updated_at: string;
  reviews?: Review[];
}

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ScriptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' });
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    fetchScript();
  }, [id]);

  const fetchScript = async () => {
    try {
      const response = await fetch(`${API_BASE}/c943bcfa-43f3-4975-bb8c-7abad2a4776e/${id}`);
      const data = await response.json();
      setScript(data);
    } catch (error) {
      toast.error('Ошибка загрузки скрипта');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!script) return;
    
    try {
      await fetch(`${API_BASE}/c943bcfa-43f3-4975-bb8c-7abad2a4776e/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ downloads: script.downloads + 1 })
      });
      
      const blob = new Blob([script.script_content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${script.name.replace(/\s+/g, '_')}.lua`;
      a.click();
      
      setScript({ ...script, downloads: script.downloads + 1 });
      toast.success('Скрипт скачан!');
    } catch (error) {
      toast.error('Ошибка скачивания');
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.user_name || !newReview.comment) {
      toast.error('Заполните все поля');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/7a8b0f3a-2a8b-4031-a61a-34846b33fae9`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script_id: id,
          ...newReview
        })
      });

      if (response.ok) {
        toast.success('Отзыв добавлен!');
        setNewReview({ user_name: '', rating: 5, comment: '' });
        fetchScript();
      }
    } catch (error) {
      toast.error('Ошибка добавления отзыва');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!script) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="FileX" size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Скрипт не найден</h2>
          <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Icon name="Code2" size={16} className="text-white" />
              </div>
              <span className="font-bold font-rajdhani gradient-text">DELTA XENO</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <Icon name="Settings" size={16} className="mr-2" />
            Админ
          </Button>
        </div>
      </nav>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-3xl font-rajdhani">{script.name}</CardTitle>
                      {script.verified && (
                        <Icon name="BadgeCheck" size={24} className="text-primary" />
                      )}
                    </div>
                    <CardDescription className="text-base">{script.description}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary text-primary">
                    <Icon name="Tag" size={12} className="mr-1" />
                    {script.category}
                  </Badge>
                  <Badge variant="secondary">
                    <Icon name="Gamepad2" size={12} className="mr-1" />
                    {script.game}
                  </Badge>
                  <Badge variant="secondary">
                    <Icon name="User" size={12} className="mr-1" />
                    {script.author}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="Star" size={20} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xl font-bold">{parseFloat(script.rating).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Download" size={20} />
                    <span>{script.downloads.toLocaleString()} загрузок</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Calendar" size={20} />
                    <span>{new Date(script.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button className="flex-1 gradient-primary border-0" size="lg" onClick={handleDownload}>
                    <Icon name="Download" size={20} className="mr-2" />
                    Скачать скрипт
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setShowCode(!showCode)}>
                    <Icon name={showCode ? "EyeOff" : "Eye"} size={20} className="mr-2" />
                    {showCode ? 'Скрыть' : 'Просмотр'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Icon name="Share2" size={20} />
                  </Button>
                </div>

                {showCode && (
                  <Card className="bg-muted border-border animate-fade-in">
                    <CardContent className="p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{script.script_content}</code>
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-rajdhani">Отзывы</CardTitle>
                <CardDescription>
                  {script.reviews?.length || 0} отзывов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Input
                    placeholder="Ваше имя"
                    value={newReview.user_name}
                    onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })}
                  />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Icon
                          name="Star"
                          size={24}
                          className={star <= newReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}
                        />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Ваш отзыв..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                  />
                  <Button onClick={handleSubmitReview} className="gradient-primary border-0">
                    <Icon name="Send" size={16} className="mr-2" />
                    Отправить отзыв
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  {script.reviews?.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0 animate-fade-in">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="gradient-primary text-white">
                            {review.user_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">{review.user_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Icon
                                key={i}
                                name="Star"
                                size={14}
                                className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-rajdhani">Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Shield" size={16} className="text-primary" />
                    <span className="text-muted-foreground">Статус:</span>
                    <Badge variant={script.verified ? "default" : "secondary"}>
                      {script.verified ? 'Проверено' : 'Не проверено'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="User" size={16} className="text-primary" />
                    <span className="text-muted-foreground">Автор:</span>
                    <span className="font-medium">{script.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Gamepad2" size={16} className="text-primary" />
                    <span className="text-muted-foreground">Игра:</span>
                    <span className="font-medium">{script.game}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Tag" size={16} className="text-primary" />
                    <span className="text-muted-foreground">Категория:</span>
                    <span className="font-medium">{script.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-rajdhani">Безопасность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-green-500" />
                    <span>Проверен на вирусы</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-green-500" />
                    <span>Проверен модераторами</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={16} className="text-green-500" />
                    <span>Регулярные обновления</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}