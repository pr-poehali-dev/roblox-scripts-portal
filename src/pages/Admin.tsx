import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
}

interface FormData {
  name: string;
  description: string;
  script_content: string;
  category: string;
  game: string;
  author: string;
  verified: boolean;
}

const categories = ["Combat", "Movement", "Automation", "Visual", "Misc"];
const games = ["Universal", "Blox Fruits", "Arsenal", "Phantom Forces", "Jailbreak", "Adopt Me"];

export default function Admin() {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    script_content: '',
    category: 'Combat',
    game: 'Universal',
    author: '',
    verified: false
  });

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const response = await fetch(`${API_BASE}/c943bcfa-43f3-4975-bb8c-7abad2a4776e`);
      const data = await response.json();
      setScripts(data);
    } catch (error) {
      toast.error('Ошибка загрузки скриптов');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingScript(null);
    setFormData({
      name: '',
      description: '',
      script_content: '',
      category: 'Combat',
      game: 'Universal',
      author: '',
      verified: false
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (script: Script) => {
    setEditingScript(script);
    setFormData({
      name: script.name,
      description: script.description,
      script_content: script.script_content,
      category: script.category,
      game: script.game,
      author: script.author,
      verified: script.verified
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.script_content) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    try {
      const url = editingScript 
        ? `${API_BASE}/c943bcfa-43f3-4975-bb8c-7abad2a4776e/${editingScript.id}`
        : `${API_BASE}/c943bcfa-43f3-4975-bb8c-7abad2a4776e`;
      
      const response = await fetch(url, {
        method: editingScript ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingScript ? 'Скрипт обновлён!' : 'Скрипт создан!');
        setIsDialogOpen(false);
        fetchScripts();
      }
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот скрипт?')) return;

    try {
      const response = await fetch(`${API_BASE}/c943bcfa-43f3-4975-bb8c-7abad2a4776e/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Скрипт удалён');
        fetchScripts();
      }
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const toggleVerified = async (script: Script) => {
    try {
      const response = await fetch(`${API_BASE}/c943bcfa-43f3-4975-bb8c-7abad2a4776e/${script.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !script.verified })
      });

      if (response.ok) {
        toast.success('Статус обновлён');
        fetchScripts();
      }
    } catch (error) {
      toast.error('Ошибка обновления');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              На главную
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Icon name="Shield" size={16} className="text-white" />
              </div>
              <span className="font-bold font-rajdhani gradient-text">АДМИН-ПАНЕЛЬ</span>
            </div>
          </div>
          <Button className="gradient-primary border-0" onClick={handleCreate}>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить скрипт
          </Button>
        </div>
      </nav>

      <div className="container px-4 py-8">
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="font-rajdhani">Статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{scripts.length}</div>
                <div className="text-sm text-muted-foreground">Всего скриптов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-1">
                  {scripts.filter(s => s.verified).length}
                </div>
                <div className="text-sm text-muted-foreground">Проверенных</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-1">
                  {scripts.reduce((sum, s) => sum + s.downloads, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Загрузок</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {scripts.length > 0 ? (scripts.reduce((sum, s) => sum + parseFloat(s.rating), 0) / scripts.length).toFixed(1) : '0.0'}
                </div>
                <div className="text-sm text-muted-foreground">Средний рейтинг</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all">Все скрипты ({scripts.length})</TabsTrigger>
            <TabsTrigger value="verified">Проверенные ({scripts.filter(s => s.verified).length})</TabsTrigger>
            <TabsTrigger value="unverified">Не проверенные ({scripts.filter(s => !s.verified).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {scripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVerified={toggleVerified}
              />
            ))}
          </TabsContent>

          <TabsContent value="verified" className="space-y-4">
            {scripts.filter(s => s.verified).map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVerified={toggleVerified}
              />
            ))}
          </TabsContent>

          <TabsContent value="unverified" className="space-y-4">
            {scripts.filter(s => !s.verified).map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVerified={toggleVerified}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-2xl">
              {editingScript ? 'Редактировать скрипт' : 'Новый скрипт'}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о скрипте
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ultimate ESP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание функционала скрипта"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="game">Игра</Label>
                <Select value={formData.game} onValueChange={(v) => setFormData({ ...formData, game: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Автор</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="DeltaDev"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="script_content">Код скрипта *</Label>
              <Textarea
                id="script_content"
                value={formData.script_content}
                onChange={(e) => setFormData({ ...formData, script_content: e.target.value })}
                placeholder="-- Lua code here"
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="verified"
                checked={formData.verified}
                onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
              />
              <Label htmlFor="verified">Проверенный скрипт</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="gradient-primary border-0" onClick={handleSubmit}>
              {editingScript ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ScriptCardProps {
  script: Script;
  onEdit: (script: Script) => void;
  onDelete: (id: number) => void;
  onToggleVerified: (script: Script) => void;
}

function ScriptCard({ script, onEdit, onDelete, onToggleVerified }: ScriptCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="font-rajdhani text-xl">{script.name}</CardTitle>
              {script.verified && (
                <Icon name="BadgeCheck" size={20} className="text-primary" />
              )}
            </div>
            <CardDescription>{script.description}</CardDescription>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="border-primary text-primary">{script.category}</Badge>
              <Badge variant="secondary">{script.game}</Badge>
              <Badge variant="secondary">
                <Icon name="User" size={12} className="mr-1" />
                {script.author}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(script)}>
              <Icon name="Pencil" size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(script.id)} className="text-destructive">
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Icon name="Star" size={16} className="text-yellow-500" />
              <span>{parseFloat(script.rating).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Icon name="Download" size={16} />
              <span>{script.downloads.toLocaleString()}</span>
            </div>
            <div className="text-muted-foreground">
              {new Date(script.created_at).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <Button
            variant={script.verified ? "default" : "secondary"}
            size="sm"
            onClick={() => onToggleVerified(script)}
          >
            <Icon name={script.verified ? "ShieldCheck" : "Shield"} size={16} className="mr-2" />
            {script.verified ? 'Проверен' : 'Не проверен'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}