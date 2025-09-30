-- Create scripts table
CREATE TABLE IF NOT EXISTS scripts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    script_content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    game VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.00,
    downloads INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    script_id INTEGER REFERENCES scripts(id),
    user_name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50)
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    player_count INTEGER
);

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
('Combat', 'Combat and fighting scripts', 'Sword'),
('Movement', 'Speed and teleportation scripts', 'Zap'),
('Automation', 'Auto-farm and grinding scripts', 'Bot'),
('Visual', 'ESP and visual enhancement scripts', 'Eye'),
('Misc', 'Other useful scripts', 'Package')
ON CONFLICT (name) DO NOTHING;

-- Insert default games
INSERT INTO games (name, player_count) VALUES
('Universal', 1000000),
('Blox Fruits', 500000),
('Arsenal', 300000),
('Phantom Forces', 200000),
('Jailbreak', 150000),
('Adopt Me', 400000)
ON CONFLICT (name) DO NOTHING;

-- Insert sample scripts
INSERT INTO scripts (name, description, script_content, category, game, rating, downloads, verified, author) VALUES
('Ultimate ESP', 'Advanced ESP with customizable colors and distance indicators', '-- ESP Script\nlocal Players = game:GetService("Players")\nprint("ESP Loaded")', 'Visual', 'Universal', 4.8, 15420, true, 'DeltaDev'),
('Speed Boost Pro', 'Smooth speed modifications with anti-detection', '-- Speed Script\nlocal player = game.Players.LocalPlayer\nplayer.Character.Humanoid.WalkSpeed = 100', 'Movement', 'Universal', 4.6, 12350, true, 'XenoMaster'),
('Auto Farm Elite', 'Intelligent auto-farming with multiple game support', '-- Auto Farm\nwhile wait(1) do\n  print("Farming...")\nend', 'Automation', 'Blox Fruits', 4.9, 23100, true, 'FarmKing'),
('Aimbot Advanced', 'Precision targeting with smooth aim and prediction', '-- Aimbot\nlocal camera = workspace.CurrentCamera\nprint("Aimbot Active")', 'Combat', 'Arsenal', 4.7, 18900, true, 'AimGod'),
('Teleport Hub', 'Instant teleportation to any location on the map', '-- Teleport\nlocal player = game.Players.LocalPlayer\nprint("Teleport Ready")', 'Movement', 'Universal', 4.5, 9870, false, 'TeleUser'),
('Infinite Jump', 'Jump infinitely high with customizable height', '-- Infinite Jump\nlocal player = game.Players.LocalPlayer\nprint("Jump Enabled")', 'Movement', 'Universal', 4.4, 7650, true, 'JumpMaster')
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_scripts_category ON scripts(category);
CREATE INDEX IF NOT EXISTS idx_scripts_game ON scripts(game);
CREATE INDEX IF NOT EXISTS idx_scripts_verified ON scripts(verified);
CREATE INDEX IF NOT EXISTS idx_reviews_script_id ON reviews(script_id);