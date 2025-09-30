import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Script {
  id: number;
  name: string;
  description: string;
  category: string;
  game: string;
  rating: number;
  downloads: number;
  verified: boolean;
}

const mockScripts: Script[] = [
  {
    id: 1,
    name: "Ultimate ESP",
    description: "Advanced ESP with customizable colors and distance indicators",
    category: "Combat",
    game: "Universal",
    rating: 4.8,
    downloads: 15420,
    verified: true
  },
  {
    id: 2,
    name: "Speed Boost Pro",
    description: "Smooth speed modifications with anti-detection",
    category: "Movement",
    game: "Universal",
    rating: 4.6,
    downloads: 12350,
    verified: true
  },
  {
    id: 3,
    name: "Auto Farm Elite",
    description: "Intelligent auto-farming with multiple game support",
    category: "Automation",
    game: "Blox Fruits",
    rating: 4.9,
    downloads: 23100,
    verified: true
  },
  {
    id: 4,
    name: "Aimbot Advanced",
    description: "Precision targeting with smooth aim and prediction",
    category: "Combat",
    game: "Arsenal",
    rating: 4.7,
    downloads: 18900,
    verified: true
  },
  {
    id: 5,
    name: "Teleport Hub",
    description: "Instant teleportation to any location on the map",
    category: "Movement",
    game: "Universal",
    rating: 4.5,
    downloads: 9870,
    verified: false
  },
  {
    id: 6,
    name: "Infinite Jump",
    description: "Jump infinitely high with customizable height",
    category: "Movement",
    game: "Universal",
    rating: 4.4,
    downloads: 7650,
    verified: true
  }
];

const categories = ["All", "Combat", "Movement", "Automation", "Visual", "Misc"];
const games = ["All Games", "Universal", "Blox Fruits", "Arsenal", "Phantom Forces", "Jailbreak"];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState('All Games');

  const filteredScripts = mockScripts.filter(script => {
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

          <Button className="gradient-primary border-0">
            <Icon name="User" size={16} className="mr-2" />
            Войти
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
                      <span className="text-sm font-medium">{script.rating}</span>
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
                  <Button className="w-full mt-4 gradient-primary border-0 hover:opacity-90">
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

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