const fs = require('fs');
const path = require('path');

function fixVocabularyData() {
    const inputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-structured.json');
    const outputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-fixed.json');

    try {
        console.log('📖 Loading structured vocabulary data...');
        const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

        console.log(`Processing ${data.totalVocabulary} vocabulary entries...`);

        let fixedCount = 0;

        // Collect all valid vocabulary from all lessons
        let allValidVocabulary = [];

        data.lessons.forEach(lesson => {
            const fixedVocabulary = lesson.vocabulary.map(vocab => {
                const fixed = fixVocabularyEntry(vocab);
                if (fixed.isFixed) fixedCount++;
                return fixed.vocab;
            }).filter(vocab => isValidVocabulary(vocab));

            allValidVocabulary = allValidVocabulary.concat(fixedVocabulary);
        });

        console.log(`✅ Collected ${allValidVocabulary.length} valid vocabulary entries`);

        // Add manual high-quality vocabulary entries at the beginning
        const manualEntries = getManualVocabularyEntries();
        allValidVocabulary = manualEntries.concat(allValidVocabulary);

        // Re-group into lessons of exactly 30 words each
        const fixedLessons = [];
        const wordsPerLesson = 30;

        for (let i = 0; i < allValidVocabulary.length; i += wordsPerLesson) {
            const lessonVocab = allValidVocabulary.slice(i, i + wordsPerLesson);
            const lessonNumber = Math.floor(i / wordsPerLesson) + 1;

            // Only create lesson if it has enough words (at least 20)
            if (lessonVocab.length >= 20) {
                fixedLessons.push({
                    id: `lesson-${String(lessonNumber).padStart(3, '0')}`,
                    title: `Bài ${lessonNumber}: Từ vựng N3`,
                    description: `Học ${lessonVocab.length} từ vựng JLPT N3 quan trọng`,
                    vocabularyCount: lessonVocab.length,
                    vocabulary: lessonVocab
                });
            }
        }

        console.log(`📚 Created ${fixedLessons.length} lessons with consistent word counts`);

        // Recalculate statistics
        const allVocab = fixedLessons.flatMap(lesson => lesson.vocabulary);
        const totalVocabulary = allVocab.length;

        const outputData = {
            ...data,
            title: 'Từ Vựng N3 - Fixed Edition',
            description: 'Từ vựng JLPT N3 đã được sửa lỗi hiragana, meaning và thêm thông tin chữ Hán',
            processedAt: new Date().toISOString(),
            method: 'Fixed missing hiragana, corrected meanings, added kanji info',
            lessons: fixedLessons,
            totalLessons: fixedLessons.length,
            totalVocabulary: totalVocabulary,
            statistics: {
                ...data.statistics,
                fixedEntries: fixedCount,
                validEntries: totalVocabulary,
                entriesWithHiragana: allVocab.filter(v => v.hiragana).length,
                entriesWithKanjiInfo: allVocab.filter(v => v.kanjiInfo).length,
                manualEntries: manualEntries.length
            }
        };

        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

        console.log('\n✅ Vocabulary data fixed successfully!');
        console.log(`📊 Results:`);
        console.log(`   - Total entries: ${totalVocabulary}`);
        console.log(`   - Fixed entries: ${fixedCount}`);
        console.log(`   - Manual entries added: ${manualEntries.length}`);
        console.log(`   - Lessons: ${fixedLessons.length}`);
        console.log(`   - Entries with hiragana: ${outputData.statistics.entriesWithHiragana}`);
        console.log(`   - Entries with kanji info: ${outputData.statistics.entriesWithKanjiInfo}`);
        console.log(`   - Output file: ${outputPath}`);

        // Show preview
        console.log(`\n📚 Preview of fixed entries:`);
        const preview = allVocab.slice(0, 15);
        preview.forEach((vocab, i) => {
            console.log(`   ${i + 1}. ${vocab.kanji} (${vocab.hiragana}) → ${vocab.meaning}`);
            if (vocab.kanjiInfo) {
                console.log(`      📝 ${vocab.kanjiInfo.meaning} | 音: ${vocab.kanjiInfo.onyomi} | 訓: ${vocab.kanjiInfo.kunyomi}`);
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

function fixVocabularyEntry(vocab) {
    let isFixed = false;
    const fixed = { ...vocab };

    // Fix missing hiragana by looking up common readings
    if (!fixed.hiragana && fixed.kanji) {
        const commonReading = getCommonReading(fixed.kanji);
        if (commonReading) {
            fixed.hiragana = commonReading;
            fixed.pronunciation = romajiFromHiragana(commonReading);
            isFixed = true;
        }
    }

    // Fix truncated meanings
    if (fixed.meaning) {
        const correctedMeaning = correctTruncatedMeaning(fixed.meaning, fixed.originalText);
        if (correctedMeaning !== fixed.meaning) {
            fixed.meaning = correctedMeaning;
            isFixed = true;
        }
    }

    // Add kanji information
    if (fixed.kanji && !fixed.kanjiInfo) {
        fixed.kanjiInfo = getKanjiInfo(fixed.kanji);
        if (fixed.kanjiInfo) {
            isFixed = true;
        }
    }

    // Improve example sentence
    if (fixed.kanji && fixed.hiragana && fixed.meaning) {
        fixed.example = generateBetterExample(fixed.kanji, fixed.hiragana, fixed.meaning);
        isFixed = true;
    }

    return { vocab: fixed, isFixed };
}

function getCommonReading(kanji) {
    const commonReadings = {
        '意': 'い',
        '注': 'ちゅう',
        '味': 'あじ',
        '求': 'きゅう',
        '決': 'けつ',
        '億': 'おく',
        '中': 'なか',
        '人': 'ひと',
        '円': 'えん',
        '便': 'べん',
        '利': 'り',
        '電': 'でん',
        '話': 'わ',
        '機': 'き',
        '球': 'きゅう',
        '野': 'や',
        '政': 'せい',
        '治': 'じ',
        '経': 'けい',
        '済': 'ざい',
        '社': 'しゃ',
        '会': 'かい',
        '文': 'ぶん',
        '化': 'か',
        '自': 'し',
        '然': 'ぜん',
        '環': 'かん',
        '境': 'きょう',
        '技': 'ぎ',
        '術': 'じゅつ',
        '科': 'か',
        '学': 'がく'
    };

    return commonReadings[kanji] || null;
}

function correctTruncatedMeaning(meaning, originalText) {
    // Common truncation patterns
    const corrections = {
        'ý nghĩa': 'ý nghĩa',
        'hú ý': 'chú ý',
        'ết tâm': 'quyết tâm',
        'ệu yên': '100 triệu yên',
        'ìm kiếm': 'tìm kiếm',
        'ên cầu': 'yêu cầu',
        'ưu cầu': 'mưu cầu',
        'uyển dụng': 'tuyển dụng',
        'ềm tiện': 'tiềm tiện',
        'iện thoại': 'điện thoại',
        'ững minh': 'thông minh',
        'ếu nói đến': 'Nếu nói đến những thứ tiện lợi thì phải nhắc tới điện thoại thông minh',
        'àng tìm việc': 'đang tìm việc'
    };

    // Try direct correction
    if (corrections[meaning]) {
        return corrections[meaning];
    }

    // Try to extract full meaning from originalText
    if (originalText) {
        const vietnameseMatch = originalText.match(/[a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]*/);
        if (vietnameseMatch && vietnameseMatch[0].length > meaning.length) {
            return vietnameseMatch[0].trim();
        }
    }

    return meaning;
}

function getKanjiInfo(kanji) {
    const kanjiDatabase = {
        '意': {
            meaning: 'ý nghĩa, ý định, suy nghĩ',
            onyomi: 'イ',
            kunyomi: 'おも-う',
            vietnamese: 'Ý',
            strokes: 13
        },
        '注': {
            meaning: 'đổ, chú ý, ghi chú',
            onyomi: 'チュウ',
            kunyomi: 'そそ-ぐ',
            vietnamese: 'Chú',
            strokes: 8
        },
        '味': {
            meaning: 'vị, hương vị, ý nghĩa',
            onyomi: 'ミ',
            kunyomi: 'あじ',
            vietnamese: 'Vị',
            strokes: 8
        },
        '求': {
            meaning: 'tìm kiếm, yêu cầu, mong muốn',
            onyomi: 'キュウ、グ',
            kunyomi: 'もと-める',
            vietnamese: 'Cầu',
            strokes: 7
        },
        '決': {
            meaning: 'quyết định, giải quyết',
            onyomi: 'ケツ',
            kunyomi: 'き-める、き-まる',
            vietnamese: 'Quyết',
            strokes: 7
        },
        '億': {
            meaning: '100 triệu (đơn vị đếm)',
            onyomi: 'オク',
            kunyomi: '',
            vietnamese: 'Ức',
            strokes: 15
        },
        '便': {
            meaning: 'tiện lợi, thư từ',
            onyomi: 'ベン、ビン',
            kunyomi: 'たよ-り',
            vietnamese: 'Tiện',
            strokes: 9
        },
        '利': {
            meaning: 'lợi ích, sắc bén',
            onyomi: 'リ',
            kunyomi: 'き-く',
            vietnamese: 'Lợi',
            strokes: 7
        },
        '電': {
            meaning: 'điện, điện tử',
            onyomi: 'デン',
            kunyomi: '',
            vietnamese: 'Điện',
            strokes: 13
        },
        '話': {
            meaning: 'nói chuyện, câu chuyện',
            onyomi: 'ワ',
            kunyomi: 'はな-す、はなし',
            vietnamese: 'Thoại',
            strokes: 13
        },
        '機': {
            meaning: 'máy móc, cơ hội',
            onyomi: 'キ',
            kunyomi: 'はた',
            vietnamese: 'Cơ',
            strokes: 16
        },
        '球': {
            meaning: 'quả bóng, hình cầu',
            onyomi: 'キュウ',
            kunyomi: 'たま',
            vietnamese: 'Cầu',
            strokes: 11
        },
        '野': {
            meaning: 'đồng ruộng, dã man',
            onyomi: 'ヤ',
            kunyomi: 'の',
            vietnamese: 'Dã',
            strokes: 11
        }
    };

    // Handle compound kanji
    if (kanji.length > 1) {
        const compoundDatabase = {
            '注意': {
                meaning: 'chú ý, cảnh báo',
                onyomi: 'チュウ + イ',
                kunyomi: 'そそ-ぐ + おも-う',
                vietnamese: 'Chú + Ý',
                strokes: 21
            },
            '意味': {
                meaning: 'ý nghĩa, ý định, vị',
                onyomi: 'イ + ミ',
                kunyomi: 'おも-う + あじ',
                vietnamese: 'Ý + Vị',
                strokes: 21
            },
            '決意': {
                meaning: 'quyết định, ý định',
                onyomi: 'ケツ + イ',
                kunyomi: 'き-める + おも-う',
                vietnamese: 'Quyết + Ý',
                strokes: 20
            },
            '求める': {
                meaning: 'tìm kiếm, yêu cầu',
                onyomi: 'キュウ',
                kunyomi: 'もと-める',
                vietnamese: 'Cầu',
                strokes: 7
            }
        };

        return compoundDatabase[kanji] || null;
    }

    return kanjiDatabase[kanji] || null;
}

function getManualVocabularyEntries() {
    return [
        {
            id: 'vocab-manual-001',
            originalText: '注意 ちゅう chú ý',
            pageNumber: 1,
            kanji: '注意',
            hiragana: 'ちゅうい',
            pronunciation: 'chuui',
            meaning: 'chú ý',
            example: '注意してください。(Chuui shite kudasai.) - Xin hãy chú ý.',
            kanjiInfo: {
                meaning: 'chú ý, cảnh báo',
                onyomi: 'チュウ + イ',
                kunyomi: 'そそ-ぐ + おも-う',
                vietnamese: 'Chú + Ý',
                strokes: 21
            }
        },
        {
            id: 'vocab-manual-002',
            originalText: '意味 いみ ý nghĩa',
            pageNumber: 1,
            kanji: '意味',
            hiragana: 'いみ',
            pronunciation: 'imi',
            meaning: 'ý nghĩa',
            example: 'この言葉の意味がわかりません。(Kono kotoba no imi ga wakarimasen.) - Tôi không hiểu ý nghĩa của từ này.',
            kanjiInfo: {
                meaning: 'ý nghĩa, ý định, vị',
                onyomi: 'イ + ミ',
                kunyomi: 'おも-う + あじ',
                vietnamese: 'Ý + Vị',
                strokes: 21
            }
        },
        {
            id: 'vocab-manual-003',
            originalText: '決意 けつい quyết tâm',
            pageNumber: 1,
            kanji: '決意',
            hiragana: 'けつい',
            pronunciation: 'ketsui',
            meaning: 'quyết tâm',
            example: '彼は決意を固めた。(Kare wa ketsui wo katameta.) - Anh ấy đã quyết tâm.',
            kanjiInfo: {
                meaning: 'quyết định, ý định',
                onyomi: 'ケツ + イ',
                kunyomi: 'き-める + おも-う',
                vietnamese: 'Quyết + Ý',
                strokes: 20
            }
        },
        {
            id: 'vocab-manual-004',
            originalText: '億 おく 100 triệu yên',
            pageNumber: 1,
            kanji: '億',
            hiragana: 'おく',
            pronunciation: 'oku',
            meaning: '100 triệu (đơn vị đếm)',
            example: '一億円です。(Ichioku en desu.) - Là 100 triệu yên.',
            kanjiInfo: {
                meaning: '100 triệu',
                onyomi: 'オク',
                kunyomi: '',
                vietnamese: 'Ức',
                strokes: 15
            }
        },
        {
            id: 'vocab-manual-005',
            originalText: '求める もとめる tìm kiếm',
            pageNumber: 1,
            kanji: '求める',
            hiragana: 'もとめる',
            pronunciation: 'motomeru',
            meaning: 'tìm kiếm',
            example: '仕事を求めています。(Shigoto wo motomete imasu.) - Đang tìm việc.',
            kanjiInfo: {
                meaning: 'tìm kiếm, yêu cầu',
                onyomi: 'キュウ',
                kunyomi: 'もと-める',
                vietnamese: 'Cầu',
                strokes: 7
            }
        }
    ];
}

function isValidVocabulary(vocab) {
    // Must have either kanji or hiragana (Japanese content)
    const hasJapanese = vocab.kanji || vocab.hiragana;

    // Must have some meaning (even if short)
    const hasMeaning = vocab.meaning && vocab.meaning.trim().length > 0;

    // Skip clearly invalid entries
    const isNotJunk = vocab.meaning &&
        !vocab.meaning.includes('□') &&
        !vocab.meaning.includes('PART') &&
        !vocab.meaning.includes('まとめ') &&
        vocab.meaning !== 'Ý' &&
        vocab.meaning !== 'ý' &&
        !/^[0-9]+$/.test(vocab.meaning.trim());

    return hasJapanese && hasMeaning && isNotJunk;
}

function generateBetterExample(kanji, hiragana, meaning) {
    const templates = [
        `${kanji}は重要です。(${hiragana} wa juuyou desu.) - ${meaning} rất quan trọng.`,
        `${kanji}について勉強します。(${hiragana} ni tsuite benkyou shimasu.) - Học về ${meaning}.`,
        `私は${kanji}を理解しています。(Watashi wa ${hiragana} wo rikai shite imasu.) - Tôi hiểu về ${meaning}.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

function romajiFromHiragana(hiragana) {
    const conversions = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
        'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
        'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
        'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
        'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
        'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n'
    };

    let result = '';
    for (const char of hiragana) {
        result += conversions[char] || char;
    }
    return result;
}

fixVocabularyData();