// Comprehensive JLPT N3 Grammar Generator
// Based on actual JLPT N3 grammar requirements and common textbooks

const fs = require('fs');

function getComprehensiveN3GrammarPatterns() {
    return [
        // Group 1: Conditional and Concessive
        {
            id: 'grammar-001',
            pattern: '〜ても',
            meaning: 'dù cho, mặc dù',
            usage: 'Diễn tả việc dù có điều kiện A thì kết quả B vẫn không thay đổi',
            example: '雨が降っても、出かけます。(Ame ga futte mo, dekakemasu.) - Dù có mưa thì tôi vẫn đi ra ngoài.',
            formation: '動詞て形 + も / い形容詞くて + も / な形容詞で + も / 名詞で + も',
            notes: 'Diễn tả sự nhượng bộ, nhấn mạnh kết quả không thay đổi',
            level: 'N3'
        },
        {
            id: 'grammar-002',
            pattern: '〜ば',
            meaning: 'nếu',
            usage: 'Diễn tả điều kiện giả định',
            example: '時間があれば、映画を見ます。(Jikan ga areba, eiga wo mimasu.) - Nếu có thời gian thì tôi sẽ xem phim.',
            formation: '動詞ば形 / い形容詞ければ / な形容詞であれば / 名詞であれば',
            notes: 'Điều kiện giả định, thường dùng cho tình huống chưa xác định',
            level: 'N3'
        },
        {
            id: 'grammar-003',
            pattern: '〜なら',
            meaning: 'nếu như, về việc',
            usage: 'Diễn tả điều kiện hoặc chủ đề',
            example: '日本語なら、分かります。(Nihongo nara, wakarimasu.) - Về tiếng Nhật thì tôi hiểu.',
            formation: '動詞辞書形/た形 + なら / い形容詞 + なら / な形容詞 + なら / 名詞 + なら',
            notes: 'Có thể diễn tả cả điều kiện và chủ đề',
            level: 'N3'
        },

        // Group 2: Simultaneous Actions
        {
            id: 'grammar-004',
            pattern: '〜ながら',
            meaning: 'vừa... vừa..., trong khi',
            usage: 'Diễn tả hai hành động xảy ra đồng thời',
            example: '音楽を聞きながら、勉強します。(Ongaku wo kiki nagara, benkyou shimasu.) - Vừa nghe nhạc vừa học.',
            formation: '動詞ます形 + ながら',
            notes: 'Chủ thể của hai hành động phải giống nhau',
            level: 'N3'
        },
        {
            id: 'grammar-005',
            pattern: '〜とき',
            meaning: 'khi, lúc',
            usage: 'Diễn tả thời điểm xảy ra hành động',
            example: '子供のとき、よく遊びました。(Kodomo no toki, yoku asobimashita.) - Khi còn nhỏ, tôi hay chơi.',
            formation: '動詞辞書形/た形 + とき / い形容詞 + とき / な形容詞な + とき / 名詞の + とき',
            notes: 'Có thể dùng với cả quá khứ và hiện tại',
            level: 'N3'
        },

        // Group 3: Purpose and Reason
        {
            id: 'grammar-006',
            pattern: '〜ために',
            meaning: 'để, vì mục đích',
            usage: 'Diễn tả mục đích hoặc nguyên nhân',
            example: '日本語を勉強するために、日本に来ました。(Nihongo wo benkyou suru tame ni, Nihon ni kimashita.) - Tôi đến Nhật để học tiếng Nhật.',
            formation: '動詞辞書形 + ために / 名詞の + ために',
            notes: 'Khác với ように ở mức độ ý chí và kiểm soát',
            level: 'N3'
        },
        {
            id: 'grammar-007',
            pattern: '〜ように',
            meaning: 'để mà, sao cho',
            usage: 'Diễn tả mục đích với ý nghĩa mong muốn, không kiểm soát được',
            example: '忘れないように、メモを取ります。(Wasurenai you ni, memo wo torimasu.) - Để không quên, tôi ghi chú.',
            formation: '動詞辞書形/ない形 + ように',
            notes: 'Dùng cho mục đích không kiểm soát được hoặc mong muốn',
            level: 'N3'
        },

        // Group 4: Change and Transformation
        {
            id: 'grammar-008',
            pattern: '〜ようになる',
            meaning: 'trở nên có thể, bắt đầu',
            usage: 'Diễn tả sự thay đổi tình trạng, khả năng tự nhiên',
            example: '日本語が話せるようになりました。(Nihongo ga hanaseru you ni narimashita.) - Tôi đã có thể nói được tiếng Nhật.',
            formation: '動詞辞書形/可能形 + ようになる',
            notes: 'Chỉ sự thay đổi tự nhiên, không cố ý',
            level: 'N3'
        },
        {
            id: 'grammar-009',
            pattern: '〜ようにする',
            meaning: 'cố gắng để, chú ý để',
            usage: 'Diễn tả nỗ lực có ý thức để đạt được điều gì',
            example: '早く寝るようにしています。(Hayaku neru you ni shite imasu.) - Tôi cố gắng ngủ sớm.',
            formation: '動詞辞書形/ない形 + ようにする',
            notes: 'Diễn tả hành động có ý thức, cố gắng',
            level: 'N3'
        },

        // Group 5: Time and Aspects
        {
            id: 'grammar-010',
            pattern: '〜ところ',
            meaning: 'lúc, thời điểm',
            usage: 'Diễn tả thời điểm cụ thể của hành động',
            example: '今、食べているところです。(Ima, tabete iru tokoro desu.) - Bây giờ tôi đang ăn.',
            formation: '動詞辞書形/ている/た + ところ',
            notes: 'Có 3 dạng: sắp làm/đang làm/vừa làm xong',
            level: 'N3'
        },
        {
            id: 'grammar-011',
            pattern: '〜ばかり',
            meaning: 'chỉ, toàn là, vừa mới',
            usage: 'Diễn tả chỉ có một thứ duy nhất hoặc vừa mới xảy ra',
            example: 'ゲームばかりしています。(Geemu bakari shite imasu.) - Chỉ toàn chơi game thôi.',
            formation: '名詞 + ばかり / 動詞て形 + ばかり / 動詞た形 + ばかり',
            notes: 'Có thể mang ý nghĩa tiêu cực khi dùng với hành động',
            level: 'N3'
        },

        // Group 6: Completion and Results
        {
            id: 'grammar-012',
            pattern: '〜てしまう',
            meaning: 'đã hoàn thành, không may',
            usage: 'Diễn tả hành động hoàn thành hoặc sự tiếc nuối',
            example: '宿題を忘れてしまいました。(Shukudai wo wasurete shimaimashita.) - Tôi đã quên mất bài tập.',
            formation: '動詞て形 + しまう',
            notes: 'Có thể diễn tả cả hoàn thành và tiếc nuối tùy ngữ cảnh',
            level: 'N3'
        },
        {
            id: 'grammar-013',
            pattern: '〜てくる',
            meaning: 'đến đây, bắt đầu',
            usage: 'Diễn tả hướng chuyển động về phía người nói hoặc sự bắt đầu',
            example: '雨が降ってきました。(Ame ga futte kimashita.) - Trời bắt đầu mưa.',
            formation: '動詞て形 + くる',
            notes: 'Có thể diễn tả cả hướng không gian và thời gian',
            level: 'N3'
        },
        {
            id: 'grammar-014',
            pattern: '〜ていく',
            meaning: 'đi xa, tiếp tục',
            usage: 'Diễn tả hướng chuyển động ra xa hoặc sự tiếp tục',
            example: '日本語がうまくなっていきます。(Nihongo ga umaku natte ikimasu.) - Tiếng Nhật sẽ ngày càng giỏi.',
            formation: '動詞て形 + いく',
            notes: 'Diễn tả sự tiếp tục trong tương lai',
            level: 'N3'
        },

        // Group 7: Experience and Possibilities
        {
            id: 'grammar-015',
            pattern: '〜ことがある',
            meaning: 'có khi, đôi khi, đã từng',
            usage: 'Diễn tả kinh nghiệm đã từng có hoặc sự việc đôi khi xảy ra',
            example: '日本に行ったことがあります。(Nihon ni itta koto ga arimasu.) - Tôi đã từng đi Nhật.',
            formation: '動詞た形 + ことがある / 動詞辞書形 + ことがある',
            notes: 'Ta形 = kinh nghiệm, 辞書形 = tần suất',
            level: 'N3'
        },
        {
            id: 'grammar-016',
            pattern: '〜かもしれない',
            meaning: 'có thể, có lẽ',
            usage: 'Diễn tả sự suy đoán không chắc chắn',
            example: '明日雨が降るかもしれません。(Ashita ame ga furu kamoshiremasen.) - Ngày mai có thể sẽ mưa.',
            formation: '動詞普通形 + かもしれない / い形容詞 + かもしれない / な形容詞 + かもしれない / 名詞 + かもしれない',
            notes: 'Mức độ chắc chắn khoảng 50%',
            level: 'N3'
        },

        // Group 8: Decisions and Intentions
        {
            id: 'grammar-017',
            pattern: '〜ことになる',
            meaning: 'được quyết định, trở thành',
            usage: 'Diễn tả quyết định từ bên ngoài hoặc kết quả tự nhiên',
            example: '来年、日本に住むことになりました。(Rainen, Nihon ni sumu koto ni narimashita.) - Năm sau tôi sẽ sống ở Nhật.',
            formation: '動詞辞書形 + ことになる',
            notes: 'Quyết định không phải do bản thân đưa ra',
            level: 'N3'
        },
        {
            id: 'grammar-018',
            pattern: '〜ことにする',
            meaning: 'quyết định làm',
            usage: 'Diễn tả quyết định của bản thân',
            example: '毎日運動することにしました。(Mainichi undou suru koto ni shimashita.) - Tôi quyết định tập thể dục hàng ngày.',
            formation: '動詞辞書形 + ことにする',
            notes: 'Quyết định do bản thân đưa ra',
            level: 'N3'
        },
        {
            id: 'grammar-019',
            pattern: '〜つもりです',
            meaning: 'có ý định, dự định',
            usage: 'Diễn tả ý định, kế hoạch của bản thân',
            example: '来年、結婚するつもりです。(Rainen, kekkon suru tsumori desu.) - Tôi dự định kết hôn năm sau.',
            formation: '動詞辞書形 + つもり / 動詞ない形 + つもり',
            notes: 'Chỉ dùng cho ý định của bản thân',
            level: 'N3'
        },

        // Group 9: Expectations and Certainty
        {
            id: 'grammar-020',
            pattern: '〜はずです',
            meaning: 'chắc chắn, đương nhiên',
            usage: 'Diễn tả sự dự đoán có căn cứ',
            example: '彼はもう来ているはずです。(Kare wa mou kite iru hazu desu.) - Anh ấy chắc chắn đã đến rồi.',
            formation: '動詞普通形 + はず / い形容詞 + はず / な形容詞な + はず / 名詞の + はず',
            notes: 'Mức độ chắc chắn cao hơn でしょう',
            level: 'N3'
        },
        {
            id: 'grammar-021',
            pattern: '〜そうです',
            meaning: 'có vẻ, trông như',
            usage: 'Diễn tả sự suy đoán dựa trên quan sát',
            example: '雨が降りそうです。(Ame ga furi sou desu.) - Trông như sắp mưa.',
            formation: '動詞ます形 + そう / い形容詞語幹 + そう / な形容詞 + そう',
            notes: 'Dựa trên quan sát trực tiếp, khác với ようです',
            level: 'N3'
        },
        {
            id: 'grammar-022',
            pattern: '〜ようです',
            meaning: 'có vẻ như, dường như',
            usage: 'Diễn tả suy đoán dựa trên thông tin gián tiếp',
            example: '田中さんは忙しいようです。(Tanaka-san wa isogashii you desu.) - Anh Tanaka có vẻ bận.',
            formation: '動詞普通形 + ようです / い形容詞 + ようです / な形容詞な + ようです / 名詞の + ようです',
            notes: 'Dựa trên thông tin gián tiếp hoặc suy luận',
            level: 'N3'
        },

        // Group 10: Limits and Conditions
        {
            id: 'grammar-023',
            pattern: '〜ばいい',
            meaning: 'chỉ cần, nếu làm... thì tốt',
            usage: 'Diễn tả điều kiện đơn giản để đạt mục đích',
            example: '薬を飲めばいいです。(Kusuri wo nomeba ii desu.) - Chỉ cần uống thuốc là được.',
            formation: '動詞ば形 + いい',
            notes: 'Dùng để đưa ra lời khuyên đơn giản',
            level: 'N3'
        },
        {
            id: 'grammar-024',
            pattern: '〜だけ',
            meaning: 'chỉ, chỉ có',
            usage: 'Diễn tả giới hạn, chỉ có một thứ',
            example: '水だけ飲みます。(Mizu dake nomimasu.) - Chỉ uống nước thôi.',
            formation: '名詞 + だけ / 動詞辞書形 + だけ',
            notes: 'Nhấn mạnh giới hạn hoặc số lượng ít',
            level: 'N3'
        },
        {
            id: 'grammar-025',
            pattern: '〜しか',
            meaning: 'chỉ có (với ý nghĩa hạn chế)',
            usage: 'Diễn tả giới hạn với ý nghĩa tiêu cực',
            example: '千円しかありません。(Sen-en shika arimasen.) - Chỉ có 1000 yên thôi (ít quá).',
            formation: '名詞 + しか + 動詞否定形',
            notes: 'Luôn đi với động từ phủ định, mang ý nghĩa "ít quá"',
            level: 'N3'
        },

        // Group 11: Passive and Causative
        {
            id: 'grammar-026',
            pattern: '〜れる/られる (受身)',
            meaning: 'bị (thể bị động)',
            usage: 'Diễn tả hành động được thực hiện bởi người khác',
            example: '泥棒に財布を盗まれました。(Dorobou ni saifu wo nusumaremashita.) - Tôi bị kẻ trộm lấy mất ví.',
            formation: '動詞受身形',
            notes: 'Có thể diễn tả cả bị động và tôn kính',
            level: 'N3'
        },
        {
            id: 'grammar-027',
            pattern: '〜せる/させる (使役)',
            meaning: 'khiến cho, bắt (thể sai khiến)',
            usage: 'Diễn tả việc khiến người khác làm gì',
            example: '子供に薬を飲ませます。(Kodomo ni kusuri wo nomasemasu.) - Cho con uống thuốc.',
            formation: '動詞使役形',
            notes: 'Có thể mang ý nghĩa cưỡng bức hoặc cho phép',
            level: 'N3'
        },

        // Group 12: Giving and Receiving
        {
            id: 'grammar-028',
            pattern: '〜てもらう',
            meaning: 'nhờ ai làm gì (người nói được lợi)',
            usage: 'Diễn tả việc nhận được hành động từ người khác',
            example: '先生に教えてもらいました。(Sensei ni oshiete moraimashita.) - Tôi được thầy dạy.',
            formation: '動詞て形 + もらう',
            notes: 'Người nói là người nhận lợi ích',
            level: 'N3'
        },
        {
            id: 'grammar-029',
            pattern: '〜てあげる',
            meaning: 'làm gì cho ai (người khác được lợi)',
            usage: 'Diễn tả việc làm gì đó cho người khác',
            example: '友達に本を貸してあげました。(Tomodachi ni hon wo kashite agemashita.) - Tôi cho bạn mượn sách.',
            formation: '動詞て形 + あげる',
            notes: 'Người khác là người nhận lợi ích',
            level: 'N3'
        },
        {
            id: 'grammar-030',
            pattern: '〜てくれる',
            meaning: 'ai đó làm gì cho tôi',
            usage: 'Diễn tả việc người khác làm gì cho người nói',
            example: '母が料理を作ってくれました。(Haha ga ryouri wo tsukutte kuremashita.) - Mẹ nấu cơm cho tôi.',
            formation: '動詞て形 + くれる',
            notes: 'Người nói là người nhận lợi ích từ người khác',
            level: 'N3'
        }
    ];
}

function createComprehensiveGrammarData() {
    console.log('🏗️ Generating comprehensive N3 grammar data...');

    const grammarPatterns = getComprehensiveN3GrammarPatterns();

    // Create lessons with 6 patterns each for better learning
    const itemsPerLesson = 6;
    const lessons = [];

    for (let i = 0; i < grammarPatterns.length; i += itemsPerLesson) {
        const lessonItems = grammarPatterns.slice(i, i + itemsPerLesson);
        const lessonNumber = Math.floor(i / itemsPerLesson) + 1;

        lessons.push({
            id: `grammar-lesson-${String(lessonNumber).padStart(3, '0')}`,
            title: `Bài ${lessonNumber}: Ngữ pháp N3`,
            description: `Học ${lessonItems.length} mẫu ngữ pháp JLPT N3 quan trọng`,
            grammarCount: lessonItems.length,
            grammar: lessonItems
        });
    }

    const grammarData = {
        totalGrammar: grammarPatterns.length,
        totalLessons: lessons.length,
        generatedAt: new Date().toISOString(),
        level: 'N3',
        description: 'Tổng hợp đầy đủ ngữ pháp JLPT N3',
        lessons: lessons,
        statistics: {
            patternsPerLesson: itemsPerLesson,
            avgExamplesPerPattern: 1,
            totalExamples: grammarPatterns.length,
            extractionMethod: 'COMPREHENSIVE_MANUAL',
            grammarGroups: 12
        }
    };

    // Save to file
    const outputPath = './public/data/ngu-phap-n3.json';
    fs.writeFileSync(outputPath, JSON.stringify(grammarData, null, 2), 'utf8');

    console.log('✅ Comprehensive grammar data generated successfully!');
    console.log(`📊 Results:`);
    console.log(`   - Total patterns: ${grammarPatterns.length}`);
    console.log(`   - Total lessons: ${lessons.length}`);
    console.log(`   - Patterns per lesson: ${itemsPerLesson}`);
    console.log(`   - Output file: ${outputPath}`);

    // Preview by groups
    console.log('\n📚 Grammar groups overview:');
    const groups = [
        'Conditional & Concessive (1-3)',
        'Simultaneous Actions (4-5)',
        'Purpose & Reason (6-7)',
        'Change & Transformation (8-9)',
        'Time & Aspects (10-11)',
        'Completion & Results (12-14)',
        'Experience & Possibilities (15-16)',
        'Decisions & Intentions (17-19)',
        'Expectations & Certainty (20-22)',
        'Limits & Conditions (23-25)',
        'Passive & Causative (26-27)',
        'Giving & Receiving (28-30)'
    ];

    groups.forEach((group, index) => {
        console.log(`${index + 1}. ${group}`);
    });

    return grammarData;
}

createComprehensiveGrammarData();