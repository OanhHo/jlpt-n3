// Simple grammar extraction script
// Copy từ extract_vocabulary_structured.cjs và modify cho grammar

const fs = require('fs');
const path = require('path');

// Simulate grammar extraction - will be replaced with actual PDF parsing later
function simulateGrammarExtraction() {
    console.log('📖 Simulating grammar extraction from PDF...');

    // Sample N3 grammar patterns based on typical JLPT content
    const sampleGrammarItems = [
        {
            id: 'grammar-001',
            pattern: '〜ても',
            meaning: 'dù cho, mặc dù',
            usage: 'Diễn tả việc dù có điều kiện A thì kết quả B vẫn không thay đổi',
            example: '雨が降っても、出かけます。(Ame ga futte mo, dekakemasu.) - Dù có mưa thì tôi vẫn đi ra ngoài.',
            level: 'N3',
            formation: '動詞て形 + も',
            notes: 'Có thể dùng với い-adj, な-adj, danh từ'
        },
        {
            id: 'grammar-002',
            pattern: '〜ながら',
            meaning: 'vừa... vừa..., trong khi',
            usage: 'Diễn tả hai hành động xảy ra đồng thời',
            example: '音楽を聞きながら、勉強します。(Ongaku wo kiki nagara, benkyou shimasu.) - Vừa nghe nhạc vừa học.',
            level: 'N3',
            formation: '動詞ます形 + ながら',
            notes: 'Chủ thể của hai hành động phải giống nhau'
        },
        {
            id: 'grammar-003',
            pattern: '〜ために',
            meaning: 'để, vì mục đích',
            usage: 'Diễn tả mục đích hoặc nguyên nhân',
            example: '日本語を勉強するために、日本に来ました。(Nihongo wo benkyou suru tame ni, Nihon ni kimashita.) - Tôi đến Nhật để học tiếng Nhật.',
            level: 'N3',
            formation: '動詞辞書形/名詞の + ために',
            notes: 'Khác với ように ở mức độ ý chí'
        },
        {
            id: 'grammar-004',
            pattern: '〜ようになる',
            meaning: 'trở nên có thể, bắt đầu',
            usage: 'Diễn tả sự thay đổi tình trạng, khả năng',
            example: '日本語が話せるようになりました。(Nihongo ga hanaseru you ni narimashita.) - Tôi đã có thể nói được tiếng Nhật.',
            level: 'N3',
            formation: '動詞辞書形/可能形 + ようになる',
            notes: 'Chỉ sự thay đổi tự nhiên, không cố ý'
        },
        {
            id: 'grammar-005',
            pattern: '〜ところ',
            meaning: 'lúc, thời điểm',
            usage: 'Diễn tả thời điểm cụ thể của hành động',
            example: '今、食べているところです。(Ima, tabete iru tokoro desu.) - Bây giờ tôi đang ăn.',
            level: 'N3',
            formation: '動詞各形 + ところ',
            notes: 'Có 3 dạng: する/している/した + ところ'
        },
        {
            id: 'grammar-006',
            pattern: '〜はずです',
            meaning: 'chắc chắn, đương nhiên',
            usage: 'Diễn tả sự dự đoán có căn cứ',
            example: '彼はもう来ているはずです。(Kare wa mou kite iru hazu desu.) - Anh ấy chắc chắn đã đến rồi.',
            level: 'N3',
            formation: '動詞各形/い-adj/な-adj/名詞 + はず',
            notes: 'Mức độ chắc chắn cao hơn でしょう'
        },
        {
            id: 'grammar-007',
            pattern: '〜そうです',
            meaning: 'có vẻ, trông như',
            usage: 'Diễn tả sự suy đoán dựa trên quan sát',
            example: '雨が降りそうです。(Ame ga furi sou desu.) - Trông như sắp mưa.',
            level: 'N3',
            formation: '動詞ます形/い-adjective stem + そう',
            notes: 'Khác với ようです ở cách thu thập thông tin'
        },
        {
            id: 'grammar-008',
            pattern: '〜ばかり',
            meaning: 'chỉ, toàn là',
            usage: 'Diễn tả chỉ có một thứ duy nhất',
            example: 'ゲームばかりしています。(Geemu bakari shite imasu.) - Chỉ toàn chơi game thôi.',
            level: 'N3',
            formation: '名詞/動詞て形 + ばかり',
            notes: 'Có ý nghĩa tiêu cực khi dùng với hành động'
        },
        {
            id: 'grammar-009',
            pattern: '〜ばいい',
            meaning: 'chỉ cần, nếu làm... thì tốt',
            usage: 'Diễn tả điều kiện đơn giản để đạt mục đích',
            example: '薬を飲めばいいです。(Kusuri wo nomeba ii desu.) - Chỉ cần uống thuốc là được.',
            level: 'N3',
            formation: '動詞ば形 + いい',
            notes: 'Dùng để đưa ra lời khuyên đơn giản'
        },
        {
            id: 'grammar-010',
            pattern: '〜てしまう',
            meaning: 'đã hoàn thành, không may',
            usage: 'Diễn tả hành động hoàn thành hoặc sự tiếc nuối',
            example: '宿題を忘れてしまいました。(Shukudai wo wasurete shimaimashita.) - Tôi đã quên mất bài tập.',
            level: 'N3',
            formation: '動詞て形 + しまう',
            notes: 'Có thể diễn tả cả hoàn thành và tiếc nuối'
        },
        {
            id: 'grammar-011',
            pattern: '〜ことがある',
            meaning: 'có khi, đôi khi',
            usage: 'Diễn tả kinh nghiệm đã từng có hoặc sự việc đôi khi xảy ra',
            example: '日本に行ったことがあります。(Nihon ni itta koto ga arimasu.) - Tôi đã từng đi Nhật.',
            level: 'N3',
            formation: '動詞た形 + ことがある',
            notes: 'Diễn tả kinh nghiệm trong quá khứ'
        },
        {
            id: 'grammar-012',
            pattern: '〜ことになる',
            meaning: 'được quyết định, trở thành',
            usage: 'Diễn tả quyết định từ bên ngoài hoặc kết quả tự nhiên',
            example: '来年、日本に住むことになりました。(Rainen, Nihon ni sumu koto ni narimashita.) - Năm sau tôi sẽ sống ở Nhật.',
            level: 'N3',
            formation: '動詞辞書形 + ことになる',
            notes: 'Quyết định không phải do bản thân'
        },
        {
            id: 'grammar-013',
            pattern: '〜ことにする',
            meaning: 'quyết định làm',
            usage: 'Diễn tả quyết định của bản thân',
            example: '毎日運動することにしました。(Mainichi undou suru koto ni shimashita.) - Tôi quyết định tập thể dục hàng ngày.',
            level: 'N3',
            formation: '動詞辞書形 + ことにする',
            notes: 'Quyết định do bản thân đưa ra'
        },
        {
            id: 'grammar-014',
            pattern: '〜つもりです',
            meaning: 'có ý định, dự định',
            usage: 'Diễn tả ý định, kế hoạch của bản thân',
            example: '来年、結婚するつもりです。(Rainen, kekkon suru tsumori desu.) - Tôi dự định kết hôn năm sau.',
            level: 'N3',
            formation: '動詞辞書形 + つもり',
            notes: 'Chỉ dùng cho ý định của bản thân'
        },
        {
            id: 'grammar-015',
            pattern: '〜てくる',
            meaning: 'đến đây, bắt đầu',
            usage: 'Diễn tả hướng chuyển động về phía người nói hoặc sự bắt đầu',
            example: '雨が降ってきました。(Ame ga futte kimashita.) - Trời bắt đầu mưa.',
            level: 'N3',
            formation: '動詞て形 + くる',
            notes: 'Có thể diễn tả cả hướng và thời gian'
        }
    ];

    return sampleGrammarItems;
}

function createGrammarLessons(grammarItems) {
    const lessons = [];
    const itemsPerLesson = 5; // 5 grammar patterns per lesson

    for (let i = 0; i < grammarItems.length; i += itemsPerLesson) {
        const lessonItems = grammarItems.slice(i, i + itemsPerLesson);
        const lessonNumber = Math.floor(i / itemsPerLesson) + 1;

        lessons.push({
            id: `grammar-lesson-${String(lessonNumber).padStart(3, '0')}`,
            title: `Bài ${lessonNumber}: Ngữ pháp N3`,
            description: `Học ${lessonItems.length} mẫu ngữ pháp JLPT N3 quan trọng`,
            grammarCount: lessonItems.length,
            grammar: lessonItems
        });
    }

    return lessons;
}

function generateGrammarData() {
    console.log('🏗️ Generating N3 grammar data...');

    // Get sample grammar items (will be replaced with PDF extraction)
    const grammarItems = simulateGrammarExtraction();

    // Create lessons
    const lessons = createGrammarLessons(grammarItems);

    // Create final data structure
    const grammarData = {
        totalGrammar: grammarItems.length,
        totalLessons: lessons.length,
        generatedAt: new Date().toISOString(),
        level: 'N3',
        description: 'Tổng hợp ngữ pháp JLPT N3',
        lessons: lessons,
        statistics: {
            patternsPerLesson: 5,
            avgExamplesPerPattern: 1,
            totalExamples: grammarItems.length
        }
    };

    // Save to file
    const outputPath = './public/data/ngu-phap-n3.json';
    fs.writeFileSync(outputPath, JSON.stringify(grammarData, null, 2), 'utf8');

    console.log('✅ Grammar data generated successfully!');
    console.log(`📊 Results:`);
    console.log(`   - Total patterns: ${grammarItems.length}`);
    console.log(`   - Total lessons: ${lessons.length}`);
    console.log(`   - Output file: ${outputPath}`);

    // Preview
    console.log('\n📚 Preview of first 3 grammar patterns:');
    grammarItems.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.pattern} - ${item.meaning}`);
        console.log(`   📝 ${item.usage}`);
        console.log(`   🔸 ${item.example}`);
        console.log('');
    });

    return grammarData;
}

// Execute
generateGrammarData();