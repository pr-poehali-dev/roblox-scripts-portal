INSERT INTO t_p10328449_roblox_scripts_porta.scripts (name, description, script_content, category, game, author, verified, rating, downloads) VALUES 
('Infinite Jump', 'Jump infinitely high in any game', 'while true do
  game.Players.LocalPlayer.Character.Humanoid.JumpPower = 150
  wait(0.5)
end', 'Movement', 'Universal', 'JumpMaster', TRUE, '4.6', 2340),
('Auto Clicker Pro', 'Professional auto clicking tool with customizable speed', 'local mouse = game.Players.LocalPlayer:GetMouse()
while true do
  mouse1click()
  wait(0.01)
end', 'Automation', 'Universal', 'ClickBot', TRUE, '4.3', 1567),
('Wallhack ESP', 'See players through walls with customizable colors', 'for _, player in pairs(game.Players:GetPlayers()) do
  if player ~= game.Players.LocalPlayer then
    local highlight = Instance.new("Highlight")
    highlight.Parent = player.Character
  end
end', 'Visual', 'Universal', 'ESPGod', FALSE, '3.9', 890),
('God Mode', 'Become invincible in combat games', 'game.Players.LocalPlayer.Character.Humanoid.MaxHealth = math.huge
game.Players.LocalPlayer.Character.Humanoid.Health = math.huge', 'Combat', 'Universal', 'ImmortalUser', FALSE, '3.2', 3450),
('Fruit Auto Farm', 'Automated fruit farming with path optimization', 'local fruits = workspace.Fruits:GetChildren()
for _, fruit in pairs(fruits) do
  game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = fruit.CFrame
  wait(1)
end', 'Automation', 'Blox Fruits', 'FarmKing', TRUE, '4.8', 5670),
('Aimbot Arsenal', 'Perfect aim assistance for Arsenal game', 'local player = game.Players.LocalPlayer
local mouse = player:GetMouse()

while true do
  local target = getClosestPlayer()
  if target then
    mouse.Hit = target.Head.CFrame
  end
  wait()
end', 'Combat', 'Arsenal', 'AimPro', TRUE, '4.5', 4321),
('Teleport GUI', 'Teleport to any location instantly', 'local gui = Instance.new("ScreenGui")
local frame = Instance.new("Frame")
frame.Parent = gui
gui.Parent = game.Players.LocalPlayer.PlayerGui', 'Movement', 'Universal', 'TeleportMaster', TRUE, '4.7', 2890),
('Jailbreak Auto Rob', 'Automatically rob all stores in Jailbreak', 'local stores = {"Bank", "Museum", "JewelryStore"}
for _, store in pairs(stores) do
  robStore(store)
  wait(5)
end', 'Automation', 'Jailbreak', 'RobberPro', FALSE, '4.1', 3200);