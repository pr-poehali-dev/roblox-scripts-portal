import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const API_BASE = 'https://functions.poehali.dev';

interface Script {
  id: number;
  name: string;
  description: string;
  category: string;
  game: string;
  rating: string;
  downloads: number;
  verified: boolean;
  author: string;
}

const categories = ["All", "Combat", "Movement", "Automation", "Visual", "Misc"];
const games = ["All Games", "Universal", "Blox Fruits", "Arsenal", "Phantom Forces", "Jailbreak"];

export default function Index() {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState('All Games');

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedGame !== 'All Games') params.append('game', selectedGame);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`${API_BASE}/c943bcfa-43f3-4975-bb8c-7abad2a4776e?${params}`);
      const data = await response.json();
      setScripts(data);
    } catch (error) {
      toast.error('Ошибка загрузки скриптов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, [selectedCategory, selectedGame]);

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || script.category === selectedCategory;
    const matchesGame = selectedGame === 'All Games' || script.game === selectedGame;
    return matchesSearch && matchesCategory && matchesGame;
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Icon name="Code2" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold font-rajdhani gradient-text">DELTA XENO</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Главная</a>
            <a href="#scripts" className="text-sm font-medium hover:text-primary transition-colors">Скрипты</a>
            <a href="#catalog" className="text-sm font-medium hover:text-primary transition-colors">Каталог</a>
            <a href="#community" className="text-sm font-medium hover:text-primary transition-colors">Сообщество</a>
            <a href="#support" className="text-sm font-medium hover:text-primary transition-colors">Поддержка</a>
          </div>

          <Button className="gradient-primary border-0" onClick={() => navigate('/admin')}>
            <Icon name="Settings" size={16} className="mr-2" />
            Админ
          </Button>
        </div>
      </nav>

      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-primary opacity-10"></div>
        <div className="container relative px-4">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-bold font-rajdhani mb-6 gradient-text">
              DELTA XENO
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Мощный портал скриптов для Roblox с проверенной безопасностью
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary border-0 text-lg">
                <Icon name="Download" size={20} className="mr-2" />
                Скачать Executor
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-primary hover:bg-primary/10">
                <Icon name="BookOpen" size={20} className="mr-2" />
                Документация
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="scripts" className="py-16 border-t border-border">
        <div className="container px-4">
          <div className="mb-8 animate-slide-up">
            <h3 className="text-3xl font-bold font-rajdhani mb-2">Каталог скриптов</h3>
            <p className="text-muted-foreground">Проверенные и безопасные скрипты для Roblox</p>
          </div>

          <div className="mb-8 space-y-4 animate-scale-in">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск скриптов..."
                  className="pl-10 h-12 bg-card border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchScripts()}
                />
              </div>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-full md:w-48 h-12 bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {games.map(game => (
                    <SelectItem key={game} value={game}>{game}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="w-full justify-start bg-card border border-border h-auto flex-wrap gap-2 p-2">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="data-[state=active]:gradient-primary data-[state=active]:text-white"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Icon name="Loader2" size={48} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScripts.map((script, index) => (
              <Card 
                key={script.id} 
                className="bg-card border-border hover:border-primary transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="font-rajdhani text-xl flex items-center gap-2">
                      {script.name}
                      {script.verified && (
                        <Icon name="BadgeCheck" size={18} className="text-primary" />
                      )}
                    </CardTitle>
                    <Badge variant="outline" className="border-primary text-primary">
                      {script.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{script.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{parseFloat(script.rating).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="Download" size={16} />
                      <span className="text-sm">{script.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Icon name="Gamepad2" size={12} className="mr-1" />
                      {script.game}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full mt-4 gradient-primary border-0 hover:opacity-90"
                    onClick={() => navigate(`/script/${script.id}`)}
                  >
                    <Icon name="Eye" size={16} className="mr-2" />
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            ))}
            </div>
          )}

          {filteredScripts.length === 0 && (
            <div className="text-center py-12">
              <Icon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h4 className="text-xl font-semibold mb-2">Скрипты не найдены</h4>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 border-t border-border bg-card/30">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold font-rajdhani mb-2">Проверенная безопасность</h4>
              <p className="text-muted-foreground">Все скрипты проходят модерацию и проверку</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold font-rajdhani mb-2">Активное сообщество</h4>
              <p className="text-muted-foreground">Тысячи пользователей и разработчиков</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Icon name="Zap" size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold font-rajdhani mb-2">Регулярные обновления</h4>
              <p className="text-muted-foreground">Новые скрипты каждую неделю</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 mt-16">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Icon name="Code2" size={16} className="text-white" />
              </div>
              <span className="font-bold font-rajdhani gradient-text">DELTA XENO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Delta Xeno. Все права защищены.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="MessageCircle" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Github" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Twitter" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}