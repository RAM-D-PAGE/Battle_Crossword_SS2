// ═══════════════════════════════════════
// Internationalization (i18n) Module
// ═══════════════════════════════════════

export type Language = 'en' | 'th';

type TranslationKeys = {
    // Menu
    'menu.title1': string;
    'menu.title2': string;
    'menu.subtitle': string;
    'menu.continue': string;
    'menu.newGame': string;
    'menu.level': string;
    'menu.selectClass': string;
    'menu.selectClassDesc': string;
    'menu.back': string;
    'menu.multiplayer': string;
    'menu.multiplayerDesc': string;
    'menu.bestiary': string;
    'menu.bestiaryDesc': string;
    'menu.leaderboard': string;
    'menu.leaderboardDesc': string;
    'menu.shop': string;
    'menu.shopDesc': string;
    'menu.inventory': string;
    'menu.inventoryDesc': string;

    // Multiplayer
    'multi.subtitle': string;
    'multi.online': string;
    'multi.browseRooms': string;
    'multi.createRoom': string;
    'multi.join': string;
    'multi.inGame': string;
    'multi.quickMatch': string;
    'multi.roomName': string;
    'multi.roomNamePlaceholder': string;
    'multi.maxPlayers': string;
    'multi.players': string;
    'multi.privateRoom': string;
    'multi.createAndStart': string;

    // Bestiary
    'bestiary.discovered': string;
    'bestiary.attack': string;
    'bestiary.element': string;
    'bestiary.speed': string;

    // Leaderboard
    'leaderboard.subtitle': string;

    // Shop
    'shop.title': string;
    'shop.skills': string;
    'shop.weapons': string;
    'shop.all': string;
    'shop.active': string;
    'shop.passive': string;
    'shop.buy': string;
    'shop.owned': string;
    'shop.free': string;

    // Inventory
    'inventory.title': string;
    'inventory.skills': string;
    'inventory.weapons': string;
    'inventory.activeSkills': string;
    'inventory.passiveSkills': string;
    'inventory.weaponSlot': string;
    'inventory.accessorySlot': string;
    'inventory.emptySlot': string;
    'inventory.lockedSlot': string;

    // Battle
    'battle.yourTurn': string;
    'battle.enemyTurn': string;
    'battle.castSpell': string;
    'battle.surrender': string;
    'battle.surrenderConfirm': string;
    'battle.shuffle': string;
    'battle.help': string;
    'battle.hint': string;
    'battle.score': string;
    'battle.gridEmpty': string;
    'battle.invalidWord': string;
    'battle.noHints': string;
    'battle.hintLabel': string;
    'battle.attacking': string;
    'battle.damageMsg': string;
    'battle.critMsg': string;
    'battle.effectiveMsg': string;
    'battle.shuffled': string;
    'battle.noTiles': string;
    'battle.autoSort': string;

    // Game Over
    'gameOver.victory': string;
    'gameOver.defeat': string;
    'gameOver.scoreLabel': string;
    'gameOver.levelComplete': string;
    'gameOver.journeyEnds': string;
    'gameOver.nextLevel': string;
    'gameOver.returnMenu': string;

    // Help
    'help.title': string;
    'help.battleTitle': string;
    'help.battleDesc': string;
    'help.scoringTitle': string;
    'help.scoringDesc': string;
    'help.elementsTitle': string;
    'help.elementsDesc1': string;
    'help.elementsDesc2': string;
    'help.classesTitle': string;
    'help.tipsTitle': string;
    'help.tip1': string;
    'help.tip2': string;
    'help.tip3': string;
    'help.keyboardTitle': string;
    'help.keyType': string;
    'help.keyRemove': string;
    'help.keyCast': string;
    'help.keySkill': string;
    'help.keyHelp': string;
    'help.keySample': string;
    'help.tipWildcard': string;
    'help.class.scribe': string;
    'help.class.barbarian': string;
    'help.class.rogue': string;
    'help.class.cleric': string;
    'help.class.paladin': string;
    'help.class.warlock': string;
    'help.class.ranger': string;
    'help.class.chronomancer': string;
    'help.class.necromancer': string;
    'help.class.monk': string;

    // Settings
    'settings.title': string;
    'settings.fontSize': string;
    'settings.fontNormal': string;
    'settings.fontLarge': string;
    'settings.fontXLarge': string;
    'settings.timer': string;
    'settings.timerOn': string;
    'settings.timerOff': string;
    'settings.difficulty': string;
    'settings.easy': string;
    'settings.normal': string;
    'settings.hard': string;
    'settings.language': string;
    'settings.highContrast': string;
    'settings.elderlyMode': string;
    'settings.elderlyModeDesc': string;
    'settings.tapToPlace': string;
    'settings.screenShake': string;
    'settings.autoSort': string;
    'settings.on': string;
    'settings.off': string;
    'settings.close': string;

    // Tutorial
    'tutorial.welcome': string;
    'tutorial.step1Title': string;
    'tutorial.step1Desc': string;
    'tutorial.step2Title': string;
    'tutorial.step2Desc': string;
    'tutorial.step3Title': string;
    'tutorial.step3Desc': string;
    'tutorial.step4Title': string;
    'tutorial.step4Desc': string;
    'tutorial.next': string;
    'tutorial.skip': string;
    'tutorial.finish': string;

    // Classes
    'class.scribe': string;
    'class.scribeDesc': string;
    'class.barbarian': string;
    'class.barbarianDesc': string;
    'class.rogue': string;
    'class.rogueDesc': string;
    'class.cleric': string;
    'class.clericDesc': string;
    'class.paladin': string;
    'class.paladinDesc': string;
    'class.warlock': string;
    'class.warlockDesc': string;
    'class.ranger': string;
    'class.rangerDesc': string;
    'class.chronomancer': string;
    'class.chronomancerDesc': string;
    'class.necromancer': string;
    'class.necromancerDesc': string;
    'class.monk': string;
    'class.monkDesc': string;

    // Damage Preview
    'preview.estimated': string;
    'preview.damage': string;

};

const translations: Record<Language, TranslationKeys> = {
    en: {
        // Menu
        'menu.title1': 'BATTLE',
        'menu.title2': 'CROSSWORD',
        'menu.subtitle': 'Words are Weapons',
        'menu.continue': 'Continue',
        'menu.newGame': 'New Game',
        'menu.level': 'LV.',
        'menu.selectClass': 'Choose Your Class',
        'menu.selectClassDesc': 'Each class has unique abilities and playstyles',
        'menu.back': 'Back',
        'menu.multiplayer': 'Multiplayer',
        'menu.multiplayerDesc': 'Battle other players online',
        'menu.bestiary': 'Bestiary',
        'menu.bestiaryDesc': 'Discover enemies & lore',
        'menu.leaderboard': 'Leaderboard',
        'menu.leaderboardDesc': 'Top players worldwide',
        'menu.shop': 'Skill Shop',
        'menu.shopDesc': 'Buy skills & weapons',
        'menu.inventory': 'Inventory',
        'menu.inventoryDesc': 'Manage your loadout',

        // Multiplayer
        'multi.subtitle': 'Challenge players around the world',
        'multi.online': 'Online',
        'multi.browseRooms': 'Browse Rooms',
        'multi.createRoom': 'Create Room',
        'multi.join': 'Join',
        'multi.inGame': 'In Game',
        'multi.quickMatch': '⚡ Quick Match',
        'multi.roomName': 'Room Name',
        'multi.roomNamePlaceholder': 'My Awesome Room',
        'multi.maxPlayers': 'Max Players',
        'multi.players': 'players',
        'multi.privateRoom': 'Private Room',
        'multi.createAndStart': 'Create & Start',

        // Bestiary
        'bestiary.discovered': 'discovered',
        'bestiary.attack': 'ATK',
        'bestiary.element': 'Element',
        'bestiary.speed': 'Speed',

        // Leaderboard
        'leaderboard.subtitle': 'Global rankings — climb to the top!',

        // Shop
        'shop.title': '✨ Skill Shop',
        'shop.skills': 'Skills',
        'shop.weapons': 'Weapons',
        'shop.all': 'All',
        'shop.active': 'Active',
        'shop.passive': 'Passive',
        'shop.buy': 'Buy',
        'shop.owned': 'Owned',
        'shop.free': 'Free',

        // Inventory
        'inventory.title': '📦 Inventory',
        'inventory.skills': 'Skills',
        'inventory.weapons': 'Equipment',
        'inventory.activeSkills': 'Active Skills',
        'inventory.passiveSkills': 'Passive Skills',
        'inventory.weaponSlot': 'Weapon Slot',
        'inventory.accessorySlot': 'Accessory Slot',
        'inventory.emptySlot': 'Empty',
        'inventory.lockedSlot': 'Locked — reach Lv.5',

        // Battle
        'battle.yourTurn': 'YOUR TURN',
        'battle.enemyTurn': 'ENEMY TURN',
        'battle.castSpell': '⚡ Cast Spell',
        'battle.surrender': 'Surrender',
        'battle.surrenderConfirm': 'Are you sure you want to surrender?',
        'battle.shuffle': '🔄',
        'battle.help': 'Help',
        'battle.hint': '💡 Hint',
        'battle.score': 'Score',
        'battle.gridEmpty': 'Grid is empty!',
        'battle.invalidWord': 'Invalid Word!',
        'battle.noHints': 'No hints available',
        'battle.hintLabel': 'Try:',
        'battle.attacking': 'is attacking!',
        'battle.damageMsg': 'DMG!',
        'battle.critMsg': 'CRIT!',
        'battle.effectiveMsg': 'EFFECTIVE!',
        'battle.shuffled': 'Shuffled!',
        'battle.noTiles': 'No tiles...',
        'battle.autoSort': 'Sort A-Z',

        // Game Over
        'gameOver.victory': 'VICTORY!',
        'gameOver.defeat': 'DEFEAT',
        'gameOver.scoreLabel': 'Score',
        'gameOver.levelComplete': 'Level Complete',
        'gameOver.journeyEnds': 'Your journey ends here...',
        'gameOver.nextLevel': 'Next Level →',
        'gameOver.returnMenu': 'Return to Menu',

        // Help
        'help.title': '📖 How to Play',
        'help.battleTitle': '⚔️ Battle',
        'help.battleDesc': 'Drag tiles from your hand to the grid to form words. Press Cast Spell to deal damage!',
        'help.scoringTitle': '📝 Scoring',
        'help.scoringDesc': 'Longer words = more damage. 5+ letters = 1.5x, 6 = 1.8x, 7 = 2.0x!',
        'help.elementsTitle': '🔥 Elements',
        'help.elementsDesc1': 'Fire → Nature → Thunder → Ice → Fire',
        'help.elementsDesc2': 'Light ↔ Dark (mutual weakness)',
        'help.classesTitle': '👤 Classes',
        'help.tipsTitle': '✨ Tips',
        'help.tip1': 'Gold tiles (J,K,Q,X,Z) give more points!',
        'help.tip2': 'Use skills wisely — they have cooldowns',
        'help.tip3': 'Watch the timer — take too long and the enemy attacks!',
        'help.keyboardTitle': '⌨️ Keyboard Shortcuts',
        'help.keyType': 'Type letters',
        'help.keyRemove': 'Remove last tile',
        'help.keyCast': 'Cast Spell',
        'help.keySkill': 'Use skill',
        'help.keyHelp': 'Help / Close',
        'help.keySample': 'Golden letters (J,K,Q,X,Z) give big points!',
        'help.tipWildcard': 'Wildcard (★) — Can be any letter! Matches any valid word.',

        // Settings
        'settings.title': '⚙️ Settings',
        'settings.fontSize': 'Font Size',
        'settings.fontNormal': 'Normal',
        'settings.fontLarge': 'Large',
        'settings.fontXLarge': 'X-Large',
        'settings.timer': 'Timer',
        'settings.timerOn': 'On',
        'settings.timerOff': 'Off (Relaxed)',
        'settings.difficulty': 'Difficulty',
        'settings.easy': 'Easy',
        'settings.normal': 'Normal',
        'settings.hard': 'Hard',
        'settings.language': 'Language',
        'settings.highContrast': 'High Contrast',
        'settings.elderlyMode': 'Full Game Mode',
        'settings.elderlyModeDesc': 'Enables timers, MP/XP displays, and standard challenges.',
        'settings.tapToPlace': 'Tap to Place',
        'settings.screenShake': 'Screen Shake',
        'settings.autoSort': 'Auto-Sort Hand',
        'settings.on': 'ON',
        'settings.off': 'OFF',
        'settings.close': 'Close',

        // Tutorial
        'tutorial.welcome': 'Welcome to Battle CrossWord!',
        'tutorial.step1Title': '📦 Your Tiles',
        'tutorial.step1Desc': 'These are your letter tiles. Each has a point value. Drag them to the grid above, or tap to select then tap a slot.',
        'tutorial.step2Title': '📝 Form a Word',
        'tutorial.step2Desc': 'Arrange tiles on the grid to spell a valid English word. Longer words deal more damage!',
        'tutorial.step3Title': '⚡ Cast Spell',
        'tutorial.step3Desc': 'Press the Cast Spell button (or Enter) to attack the enemy with your word!',
        'tutorial.step4Title': '🔮 Use Skills',
        'tutorial.step4Desc': 'Skills cost MP and have cooldowns. Use them strategically! Press number keys 1-6 for quick cast.',
        'tutorial.next': 'Next →',
        'tutorial.skip': 'Skip Tutorial',
        'tutorial.finish': 'Start Playing! 🎮',

        // Classes
        'class.scribe': 'Scribe',
        'class.scribeDesc': 'Master of long words and high burst damage.',
        'class.barbarian': 'Barbarian',
        'class.barbarianDesc': 'Fierce warrior who thrives on quick, short attacks.',
        'class.rogue': 'Rogue',
        'class.rogueDesc': 'Cunning trickster with deadly critical strikes.',
        'class.cleric': 'Cleric',
        'class.clericDesc': 'Holy healer who sustains through the power of words.',
        'class.paladin': 'Paladin',
        'class.paladinDesc': 'Holy knight who balances offense and defense.',
        'class.warlock': 'Warlock',
        'class.warlockDesc': 'Dark sorcerer who sacrifices HP for devastating power.',
        'class.ranger': 'Ranger',
        'class.rangerDesc': 'Nature hunter who deals bonus damage from vowels.',
        'class.chronomancer': 'Chronomancer',
        'class.chronomancerDesc': 'Time mage who reduces cooldowns and extends time.',
        'class.necromancer': 'Necromancer',
        'class.necromancerDesc': 'Master of death who thrives on defeating enemies.',
        'class.monk': 'Monk',
        'class.monkDesc': 'Balanced fighter with inner peace and steady damage.',

        // Help Class Descriptions (Simplified for UI)
        'help.class.scribe': '5+ words: 1.3x DMG + 15 MP',
        'help.class.barbarian': '3-4 words: 1.5x DMG',
        'help.class.rogue': '25% crit, rare letters 2x',
        'help.class.cleric': 'Heal 6 HP per word',
        'help.class.paladin': 'Light 1.5x, +5 HP/word',
        'help.class.warlock': 'Dark 1.5x, +10% DMG→MP',
        'help.class.ranger': 'Vowels (A,E,I,O,U): +2 DMG each',
        'help.class.chronomancer': 'Cooldowns -20%, +5s time',
        'help.class.necromancer': 'Defeat enemy: +20 HP',
        'help.class.monk': 'Heal 3/turn, Unique +20%',

        // Damage Preview
        'preview.estimated': 'Est.',
        'preview.damage': 'DMG',
    },

    th: {
        // Menu
        'menu.title1': 'แบทเทิล',
        'menu.title2': 'ครอสเวิร์ด',
        'menu.subtitle': 'คำคือพลัง',
        'menu.continue': 'เล่นต่อ',
        'menu.newGame': 'เกมใหม่',
        'menu.level': 'ด่าน ',
        'menu.selectClass': 'เลือกอาชีพของคุณ',
        'menu.selectClassDesc': 'แต่ละอาชีพมีความสามารถเฉพาะตัว',
        'menu.back': 'กลับ',
        'menu.multiplayer': 'ผู้เล่นหลายคน',
        'menu.multiplayerDesc': 'ต่อสู้กับผู้เล่นออนไลน์',
        'menu.bestiary': 'สัตว์ประหลาด',
        'menu.bestiaryDesc': 'ค้นพบศัตรูและเรื่องราว',
        'menu.leaderboard': 'กระดานคะแนน',
        'menu.leaderboardDesc': 'ผู้เล่นอันดับต้นทั่วโลก',
        'menu.shop': 'ร้านสกิล',
        'menu.shopDesc': 'ซื้อสกิลและอาวุธ',
        'menu.inventory': 'ช่องเก็บของ',
        'menu.inventoryDesc': 'จัดการอุปกรณ์',

        // Multiplayer
        'multi.subtitle': 'ท้าดวลผู้เล่นทั่วโลก',
        'multi.online': 'ออนไลน์',
        'multi.browseRooms': 'ค้นหาห้อง',
        'multi.createRoom': 'สร้างห้อง',
        'multi.join': 'เข้าร่วม',
        'multi.inGame': 'กำลังเล่น',
        'multi.quickMatch': '⚡ จับคู่เร็ว',
        'multi.roomName': 'ชื่อห้อง',
        'multi.roomNamePlaceholder': 'ห้องสุดเจ๋ง',
        'multi.maxPlayers': 'จำนวนผู้เล่นสูงสุด',
        'multi.players': 'คน',
        'multi.privateRoom': 'ห้องส่วนตัว',
        'multi.createAndStart': 'สร้างและเริ่มเลย',

        // Bestiary
        'bestiary.discovered': 'ค้นพบแล้ว',
        'bestiary.attack': 'โจมตี',
        'bestiary.element': 'ธาตุ',
        'bestiary.speed': 'ความเร็ว',

        // Leaderboard
        'leaderboard.subtitle': 'อันดับทั่วโลก — ไต่สู่จุดสูงสุด!',

        // Shop
        'shop.title': '✨ ร้านสกิล',
        'shop.skills': 'สกิล',
        'shop.weapons': 'อาวุธ',
        'shop.all': 'ทั้งหมด',
        'shop.active': 'แอคทีฟ',
        'shop.passive': 'แพสซีฟ',
        'shop.buy': 'ซื้อ',
        'shop.owned': 'มีแล้ว',
        'shop.free': 'ฟรี',

        // Inventory
        'inventory.title': '📦 ช่องเก็บของ',
        'inventory.skills': 'สกิล',
        'inventory.weapons': 'อุปกรณ์',
        'inventory.activeSkills': 'สกิลแอคทีฟ',
        'inventory.passiveSkills': 'สกิลแพสซีฟ',
        'inventory.weaponSlot': 'ช่องอาวุธ',
        'inventory.accessorySlot': 'ช่องเครื่องประดับ',
        'inventory.emptySlot': 'ว่าง',
        'inventory.lockedSlot': 'ล็อค — ถึงด่าน 5',

        // Battle
        'battle.yourTurn': 'ตาของคุณ',
        'battle.enemyTurn': 'ตาศัตรู',
        'battle.castSpell': '⚡ ร่ายเวทย์',
        'battle.surrender': 'ยอมแพ้',
        'battle.surrenderConfirm': 'ยอมแพ้แน่ใจหรือ?',
        'battle.shuffle': '🔄',
        'battle.help': 'ช่วยเหลือ',
        'battle.hint': '💡 คำใบ้',
        'battle.score': 'คะแนน',
        'battle.gridEmpty': 'ตารางว่างเปล่า!',
        'battle.invalidWord': 'คำไม่ถูกต้อง!',
        'battle.noHints': 'ไม่มีคำใบ้',
        'battle.hintLabel': 'ลอง:',
        'battle.attacking': 'กำลังโจมตี!',
        'battle.damageMsg': 'ความเสียหาย!',
        'battle.critMsg': 'คริติคอล!',
        'battle.effectiveMsg': 'ได้ผลดี!',
        'battle.shuffled': 'สับใหม่แล้ว!',
        'battle.noTiles': 'ไม่มีตัวอักษร...',
        'battle.autoSort': 'เรียง ก-ฮ',

        // Game Over
        'gameOver.victory': 'ชัยชนะ!',
        'gameOver.defeat': 'พ่ายแพ้',
        'gameOver.scoreLabel': 'คะแนน',
        'gameOver.levelComplete': 'ผ่านด่านแล้ว',
        'gameOver.journeyEnds': 'การเดินทางของคุณจบลงที่นี่...',
        'gameOver.nextLevel': 'ด่านถัดไป →',
        'gameOver.returnMenu': 'กลับเมนูหลัก',

        // Help
        'help.title': '📖 วิธีเล่น',
        'help.battleTitle': '⚔️ การต่อสู้',
        'help.battleDesc': 'ลากตัวอักษรจากมือไปวางบนตาราง แล้วกดร่ายเวทย์เพื่อโจมตี!',
        'help.scoringTitle': '📝 การให้คะแนน',
        'help.scoringDesc': 'คำยาว = ความเสียหายมาก, 5 ตัว = 1.5x, 6 = 1.8x, 7 = 2.0x!',
        'help.elementsTitle': '🔥 ธาตุ',
        'help.elementsDesc1': 'ไฟ → ธรรมชาติ → สายฟ้า → น้ำแข็ง → ไฟ',
        'help.elementsDesc2': 'แสง ↔ มืด (อ่อนแอต่อกัน)',
        'help.classesTitle': '👤 อาชีพ',
        'help.tipsTitle': '✨ เคล็ดลับ',
        'help.tip1': 'ตัวอักษรสีทอง (J,K,Q,X,Z) ให้คะแนนมาก!',
        'help.tip2': 'ใช้สกิลอย่างฉลาด — มี Cooldown',
        'help.tip3': 'ระวังเวลา — ช้าไปศัตรูจะโจมตี!',
        'help.keyboardTitle': '⌨️ ปุ่มลัด',
        'help.keyType': 'พิมพ์ตัวอักษร',
        'help.keyRemove': 'ลบตัวสุดท้าย',
        'help.keyCast': 'ร่ายเวทย์',
        'help.keySkill': 'ใช้สกิล',
        'help.keySample': 'ตัวอักษรสีทอง (J,K,Q,X,Z) ให้คะแนนมาก!',
        'help.keyHelp': 'ช่วยเหลือ / ปิด',
        'help.tipWildcard': 'ตัวดาว (★) — เป็นตัวอักษรอะไรก็ได้! ใช้ผสมเป็นคำที่ถูกต้องได้ทุกคำ',

        // Settings
        'settings.title': '⚙️ ตั้งค่า',
        'settings.fontSize': 'ขนาดตัวอักษร',
        'settings.fontNormal': 'ปกติ',
        'settings.fontLarge': 'ใหญ่',
        'settings.fontXLarge': 'ใหญ่มาก',
        'settings.timer': 'ตัวจับเวลา',
        'settings.timerOn': 'เปิด',
        'settings.timerOff': 'ปิด (ผ่อนคลาย)',
        'settings.difficulty': 'ระดับความยาก',
        'settings.easy': 'ง่าย',
        'settings.normal': 'ปกติ',
        'settings.hard': 'ยาก',
        'settings.language': 'ภาษา',
        'settings.highContrast': 'ความเปรียบต่างสูง',
        'settings.elderlyMode': 'เกมเต็มรูปแบบ (Full Game)',
        'settings.elderlyModeDesc': 'เปิดระบบจำกัดเวลา และแสดงเกจ MP/XP ครบถ้วน',
        'settings.tapToPlace': 'แตะเพื่อวาง',
        'settings.screenShake': 'สั่นหน้าจอ',
        'settings.autoSort': 'เรียงอัตโนมัติ',
        'settings.on': 'เปิด',
        'settings.off': 'ปิด',
        'settings.close': 'ปิด',

        // Tutorial
        'tutorial.welcome': 'ยินดีต้อนรับสู่ แบทเทิลครอสเวิร์ด!',
        'tutorial.step1Title': '📦 ตัวอักษรของคุณ',
        'tutorial.step1Desc': 'นี่คือตัวอักษรของคุณ แต่ละตัวมีคะแนน ลากไปวางบนตาราง หรือแตะเพื่อเลือกแล้วแตะช่องวาง',
        'tutorial.step2Title': '📝 สร้างคำ',
        'tutorial.step2Desc': 'เรียงตัวอักษรบนตารางเพื่อสะกดคำภาษาอังกฤษ คำยาวจะทำความเสียหายมากขึ้น!',
        'tutorial.step3Title': '⚡ ร่ายเวทย์',
        'tutorial.step3Desc': 'กดปุ่มร่ายเวทย์ (หรือ Enter) เพื่อโจมตีศัตรูด้วยคำของคุณ!',
        'tutorial.step4Title': '🔮 ใช้สกิล',
        'tutorial.step4Desc': 'สกิลใช้ MP และมี Cooldown ใช้อย่างมีกลยุทธ์! กดเลข 1-6 เพื่อใช้งานเร็ว',
        'tutorial.next': 'ถัดไป →',
        'tutorial.skip': 'ข้ามบทเรียน',
        'tutorial.finish': 'เริ่มเล่น! 🎮',

        // Classes
        'class.scribe': 'นักเขียน',
        'class.scribeDesc': 'เชี่ยวชาญคำยาวและพลังระเบิดสูง',
        'class.barbarian': 'อนารยชน',
        'class.barbarianDesc': 'นักรบดุร้ายที่ถนัดโจมตีสั้นและเร็ว',
        'class.rogue': 'โจร',
        'class.rogueDesc': 'นักหลอกลวงที่มีดาเมจวิกฤตร้ายแรง',
        'class.cleric': 'นักบวช',
        'class.clericDesc': 'ผู้รักษาศักดิ์สิทธิ์ที่อยู่รอดด้วยพลังแห่งคำ',
        'class.paladin': 'พาลาดิน',
        'class.paladinDesc': 'อัศวินศักดิ์สิทธิ์ที่สมดุลระหว่างรุกและรับ',
        'class.warlock': 'นักเวทย์มืด',
        'class.warlockDesc': 'ผู้ใช้เวทย์มืดที่สละ HP เพื่อพลังทำลายล้าง',
        'class.ranger': 'เรนเจอร์',
        'class.rangerDesc': 'พรานแห่งธรรมชาติที่ทำดาเมจโบนัสจากสระ (A,E,I,O,U)',
        'class.chronomancer': 'โครโนแมนเซอร์',
        'class.chronomancerDesc': 'จอมเวทย์เวลาที่ลดคูลดาวน์สกิลและเพิ่มเวลา',
        'class.necromancer': 'เนโครแมนเซอร์',
        'class.necromancerDesc': 'เจ้าแห่งความตายที่ฟื้นฟูพลังเมื่อกำจัดศัตรูได้',
        'class.monk': 'พระ',
        'class.monkDesc': 'นักสู้ผู้สงบนิ่งที่รักษาตัวเองและทำดาเมจมั่นคง',

        // Help Class Descriptions (Thai)
        'help.class.scribe': 'คำ 5+ ตัว: 1.3x ดาเมจ + 15 MP',
        'help.class.barbarian': 'คำ 3-4 ตัว: 1.5x ดาเมจ',
        'help.class.rogue': 'คริ 25%, ตัวหายากร x2',
        'help.class.cleric': 'ฮีล 6 HP ทุกครั้งที่ส่งคำ',
        'help.class.paladin': 'ธาตุแสง 1.5x, ฮีล 5 HP/คำ',
        'help.class.warlock': 'ธาตุมืด 1.5x, เปลี่ยนดาเมจ 10% เป็น MP',
        'help.class.ranger': 'สระ (A,E,I,O,U): +2 ดาเมจต่อตัว',
        'help.class.chronomancer': 'ลดคูลดาวน์ 20%, เพิ่มเวลา 5 วิ',
        'help.class.necromancer': 'กำจัดศัตรู: ฟื้นฟู 20 HP',
        'help.class.monk': 'ฟื้น HP 3/เทิร์น, คำไม่ซ้ำ +20%',

        // Damage Preview
        'preview.estimated': 'ประมาณ',
        'preview.damage': 'ดาเมจ',
    }
};

// ═══════════════════════════════════════
// Export function
// ═══════════════════════════════════════

let currentLanguage: Language = 'th';

export function setLanguage(lang: Language) {
    currentLanguage = lang;
}

export function getLanguage(): Language {
    return currentLanguage;
}

export function t(key: keyof TranslationKeys): string {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}
