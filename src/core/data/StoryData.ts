// ═══════════════════════════════════════════════════
// Story Data — 5 Chapters with dialogue
// ═══════════════════════════════════════════════════

export interface StoryChapter {
    id: number;
    title: string;
    titleTh: string;
    description: string;
    descriptionTh: string;
    icon: string;
    stages: number[];  // Enemy indices in this chapter
    dialogue: { speaker: string; text: string; textTh: string }[];
}

export const STORY_CHAPTERS: StoryChapter[] = [
    {
        id: 1,
        title: 'Enchanted Forest',
        titleTh: 'ป่ามนตร์สะกด',
        description: 'A mysterious forest where words hold power...',
        descriptionTh: 'ป่าลึกลับที่ถ้อยคำมีพลังวิเศษ...',
        icon: '🌲',
        stages: [0, 1, 2, 3],
        dialogue: [
            { speaker: '🧙 Elder', text: 'Young wordsmith, the forest is corrupted. Use your words to purify it!', textTh: '🧙 ผู้อาวุโส: นักสะกดคำผู้กล้า ป่าถูกมนตร์ดำเข้าครอบงำ จงใช้พลังแห่งถ้อยคำชำระมัน!' },
            { speaker: '📜 Guide', text: 'Spell words to deal damage. Longer words = more power!', textTh: '📜 ผู้นำทาง: สะกดคำเพื่อโจมตี ยิ่งคำยาว ยิ่งพลังมาก!' }
        ]
    },
    {
        id: 2,
        title: 'Volcanic Wastes',
        titleTh: 'ดินแดนภูเขาไฟ',
        description: 'The scorching lands where fire demons dwell.',
        descriptionTh: 'ดินแดนร้อนระอุที่ปีศาจไฟครองอยู่',
        icon: '🌋',
        stages: [4, 5, 6, 7],
        dialogue: [
            { speaker: '🔥 Spirit', text: 'The Orc Warlord controls these lands. His fire burns without mercy.', textTh: '🔥 วิญญาณ: อสูรกายนักรบควบคุมดินแดนนี้ เปลวไฟของมันเผาผลาญอย่างไร้ปรานี' },
            { speaker: '💡 Tip', text: 'Ice words are super effective against Fire enemies!', textTh: '💡 คำแนะนำ: คำธาตุน้ำแข็งจะมีผลรุนแรงต่อศัตรูธาตุไฟ!' }
        ]
    },
    {
        id: 3,
        title: 'Frozen Peaks',
        titleTh: 'ยอดเขาน้ำแข็ง',
        description: 'The eternal winter of the crystal mountains.',
        descriptionTh: 'ฤดูหนาวนิรันดร์แห่งภูเขาคริสตัล',
        icon: '🏔️',
        stages: [8, 9, 10, 11],
        dialogue: [
            { speaker: '❄️ Frost Sage', text: 'Beware the Frost Witch. Her blizzards can freeze you mid-spell!', textTh: '❄️ นักปราชญ์น้ำแข็ง: ระวังแม่มดน้ำแข็ง พายุหิมะของเธอแช่แข็งคุณกลางคาถาได้!' },
            { speaker: '💡 Tip', text: 'Build word combos to break through their icy defenses!', textTh: '💡 คำแนะนำ: สร้าง Combo คำต่อเนื่องเพื่อทะลุเกราะน้ำแข็ง!' }
        ]
    },
    {
        id: 4,
        title: 'Storm Citadel',
        titleTh: 'ปราสาทพายุ',
        description: 'A floating fortress struck by eternal lightning.',
        descriptionTh: 'ป้อมลอยฟ้าที่ฟ้าผ่าตลอดกาล',
        icon: '⛈️',
        stages: [12, 13, 14, 15],
        dialogue: [
            { speaker: '⚡ Thunder God', text: 'Only the mightiest wordsmiths reach this citadel. Prove your worth!', textTh: '⚡ เทพสายฟ้า: มีเพียงนักสะกดคำที่ยิ่งใหญ่เท่านั้นที่มาถึงที่นี่ จงพิสูจน์ตัวเอง!' },
            { speaker: '💡 Tip', text: 'Use rare letters (J, K, Q, X, Z) for massive bonus damage!', textTh: '💡 คำแนะนำ: ใช้ตัวอักษรหายาก (J, K, Q, X, Z) เพื่อดาเมจพิเศษ!' }
        ]
    },
    {
        id: 5,
        title: 'The Void',
        titleTh: 'ดินแดนความว่างเปล่า',
        description: 'The final realm. The Void Emperor awaits.',
        descriptionTh: 'ดินแดนสุดท้าย จักรพรรดิความว่างเปล่ารอคอยอยู่',
        icon: '🌀',
        stages: [16, 17, 18, 19],
        dialogue: [
            { speaker: '👁️ Voice', text: 'You dare enter the Void? Your words mean nothing here...', textTh: '👁\u200d เสียง: เจ้ากล้าเข้ามาในความว่างเปล่า? ถ้อยคำของเจ้าไร้ความหมายที่นี่...' },
            { speaker: '💀 Warning', text: 'The Void Emperor can use ALL status effects. Prepare yourself.', textTh: '💀 คำเตือน: จักรพรรดิสามารถใช้สถานะผิดปกติได้ทุกชนิด เตรียมตัวให้พร้อม!' }
        ]
    }
];
