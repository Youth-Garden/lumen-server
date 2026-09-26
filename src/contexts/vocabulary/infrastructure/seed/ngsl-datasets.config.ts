export interface SubTopicConfig {
  en: string;
  vi: string;
  imageUrl: string;
}

export interface NgslDatasetConfig {
  id: string;
  name: { en: string; vi: string };
  category: { en: string; vi: string };
  description: { en: string; vi: string };
  imageUrl: string;
  csvUrl: string;
  defaultCefr: string;
  subTopics: SubTopicConfig[];
}

export const NGSL_DATASETS: NgslDatasetConfig[] = [
  {
    id: 'ngsl-core',
    name: {
      en: 'General English',
      vi: 'Tiếng Anh giao tiếp',
    },
    category: {
      en: 'Communication & Spoken English',
      vi: 'Tiếng Anh giao tiếp',
    },
    description: {
      en: 'Foundational core vocabulary covering ~92% of standard English texts.',
      vi: 'Bộ từ vựng cốt lõi bao phủ 92% nội dung tiếng Anh thông dụng.',
    },
    imageUrl:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353845/lumen/vocabulary/topics/photo_1522202176988-66273c2fd55f.webp',
    csvUrl: 'https://www.newgeneralservicelist.com/s/NGSL_12_stats.csv',
    defaultCefr: 'A1-A2',
    subTopics: [
      {
        en: 'Family, Friends & Social Bonds',
        vi: 'Gia đình, Bạn bè & Gắn kết',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353853/lumen/vocabulary/topics/photo_1529156069898-49953e39b3ac.webp',
      },
      {
        en: 'Human Personality & Character',
        vi: 'Tính cách, Phẩm chất & Tâm trạng',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790354019/lumen/vocabulary/topics/topic_fallback_1790354018877.webp',
      },
      {
        en: 'Morning Habits & Domestic Routines',
        vi: 'Thói quen buổi sáng & Sinh hoạt',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353857/lumen/vocabulary/topics/photo_1506784983877-45594efa4cbe.webp',
      },
      {
        en: 'Home Living, Furniture & Chores',
        vi: 'Nhà cửa, Nội thất & Việc nhà',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353853/lumen/vocabulary/topics/photo_1513151233558-d860c5398176.webp',
      },
      {
        en: 'Cooking, Kitchen Tools & Recipes',
        vi: 'Nấu nướng, Dụng cụ bếp & Công thức',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353876/lumen/vocabulary/topics/photo_1556910103-1c02745aae4d.webp',
      },
      {
        en: 'Groceries, Flavors & Eating Out',
        vi: 'Thực phẩm, Hương vị & Ăn ngoài',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353852/lumen/vocabulary/topics/photo_1504674900247-0877df9cc836.jpg',
      },
      {
        en: 'City Landmarks & Public Spaces',
        vi: 'Địa danh đô thị & Không gian chung',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353874/lumen/vocabulary/topics/photo_1488646953014-85cb44e25828.jpg',
      },
      {
        en: 'Commuting, Vehicles & Transit',
        vi: 'Đi lại, Phương tiện & Giao thông',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353868/lumen/vocabulary/topics/photo_1549317661-bd32c8ce0db2.webp',
      },
      {
        en: 'Jobs, Professions & Occupations',
        vi: 'Nghề nghiệp, Việc làm & Chuyên môn',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353856/lumen/vocabulary/topics/photo_1497215728101-856f4ea42174.webp',
      },
      {
        en: 'Workplace Tasks & Coworkers',
        vi: 'Công việc văn phòng & Đồng nghiệp',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353862/lumen/vocabulary/topics/photo_1522071820081-009f0129c71c.webp',
      },
      {
        en: 'School Life, Classrooms & Subjects',
        vi: 'Đời sống học đường & Môn học',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353875/lumen/vocabulary/topics/photo_1523240795612-9a054b0db644.webp',
      },
      {
        en: 'Libraries, Exams & Self-Study',
        vi: 'Thư viện, Thi cử & Tự học',
        // Fresh image — replaced duplicate of NAWL Research Design (1456513080510)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353870/lumen/vocabulary/topics/photo_1497436072909-60f360e1d4b1.webp',
      },
      {
        en: 'Body, Physical Health & Medicine',
        vi: 'Cơ thể, Sức khỏe & Y tế',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353864/lumen/vocabulary/topics/photo_1505751172876-fa1923c5c528.webp',
      },
      {
        en: 'Fitness, Athletics & Outdoor Sports',
        vi: 'Thể hình, Thể thao & Vận động',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353865/lumen/vocabulary/topics/photo_1517838277536-f5f99be501cd.webp',
      },
      {
        en: 'Digital Devices, Apps & Hardware',
        vi: 'Thiết bị số & Ứng dụng điện thoại',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353877/lumen/vocabulary/topics/photo_1518770660439-4636190af475.webp',
      },
      {
        en: 'Social Media & Online Communication',
        vi: 'Mạng xã hội & Đời sống online',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353851/lumen/vocabulary/topics/photo_1516321318423-f06f85e504b3.webp',
      },
      {
        en: 'Seasons, Weather & Landscapes',
        vi: 'Mùa, Kiểu thời tiết & Cảnh quan',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353874/lumen/vocabulary/topics/photo_1441974231531-c6227db76b6e.jpg',
      },
      {
        en: 'Flora, Fauna & Animal Kingdom',
        vi: 'Động thực vật & Muông thú',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353875/lumen/vocabulary/topics/photo_1474511320723-9a56873867b5.webp',
      },
      {
        en: 'Cinema, Theater & Films',
        vi: 'Điện ảnh & Nghệ thuật sân khấu',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353871/lumen/vocabulary/topics/photo_1489599849927-2ee91cede3ba.webp',
      },
      {
        en: 'Music, Instruments & Fine Arts',
        vi: 'Âm nhạc, Nhạc cụ & Hội họa',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353866/lumen/vocabulary/topics/photo_1511671782779-c97d3d27a1d4.webp',
      },
      {
        en: 'Holidays, Festivals & Celebrations',
        vi: 'Ngày lễ, Lễ hội & Văn hóa',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353848/lumen/vocabulary/topics/photo_1461360370896-922624d12aa1.webp',
      },
      {
        en: 'Civic Services, Community & Law',
        vi: 'Dịch vụ công dân, Pháp luật & Đô thị',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353875/lumen/vocabulary/topics/photo_1586769852044-692d6e3703f0.webp',
      },
      {
        en: 'Time, Probability & Reason',
        vi: 'Thời gian, Xác suất & Suy luận',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353855/lumen/vocabulary/topics/photo_1509718443690-d8e2fb3474b7.webp',
      },
      {
        en: 'Morals, Values & Philosophical Thoughts',
        vi: 'Đạo đức, Giá trị & Tư tưởng',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353853/lumen/vocabulary/topics/photo_1507413245164-6160d8298b31.webp',
      },
    ],
  },
  {
    id: 'tsl-toeic',
    name: {
      en: 'TOEIC Advanced',
      vi: 'Từ vựng TOEIC nâng cao',
    },
    category: {
      en: 'TOEIC Vocabulary',
      vi: 'Từ vựng TOEIC',
    },
    description: {
      en: 'Essential 1,200 TOEIC test words covering ~99% of TOEIC test vocabulary.',
      vi: '1,200 từ vựng cốt lõi bao phủ 99% từ xuất hiện trong bài thi TOEIC.',
    },
    imageUrl:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353844/lumen/vocabulary/topics/photo_1486406146926-c627a92ad1ab.webp',
    csvUrl: 'https://www.newgeneralservicelist.com/s/TSL_12_stats.csv',
    defaultCefr: 'B1-B2',
    subTopics: [
      {
        en: 'Executive Leadership & Strategy',
        vi: 'Lãnh đạo & Chiến lược điều hành',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353865/lumen/vocabulary/topics/photo_1507679799987-c73779587ccf.webp',
      },
      {
        en: 'Corporate Governance & Policy',
        vi: 'Quản trị doanh nghiệp & Chính sách',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353847/lumen/vocabulary/topics/photo_1454165804606-c3d57bc86b40.webp',
      },
      {
        en: 'Banking Operations & Accounts',
        vi: 'Nghiệp vụ ngân hàng & Tài khoản',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353854/lumen/vocabulary/topics/photo_1501167786227-4cba60f6d58f.webp',
      },
      {
        en: 'Investment & Capital Markets',
        vi: 'Đầu tư & Thị trường vốn',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353861/lumen/vocabulary/topics/photo_1590283603385-17ffb3a7f29f.webp',
      },
      {
        en: 'Accounting, Tax & Fiscal Auditing',
        vi: 'Kế toán, Thuế & Kiểm toán',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353863/lumen/vocabulary/topics/photo_1554224155-8d04cb21cd6c.webp',
      },
      {
        en: 'Financial Risk & Asset Management',
        vi: 'Quản lý rủi ro & Tài sản',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353862/lumen/vocabulary/topics/photo_1611974789855-9c2a0a7236a3.webp',
      },
      {
        en: 'Supply Chain & Warehousing',
        vi: 'Chuỗi cung ứng & Kho bãi',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353876/lumen/vocabulary/topics/photo_1586528116311-ad8dd3c8310d.jpg',
      },
      {
        en: 'Freight, Shipping & Customs',
        vi: 'Vận tải hàng hóa & Hải quan',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353874/lumen/vocabulary/topics/photo_1578575437130-527eed3abbec.webp',
      },
      {
        en: 'Contracts & Business Agreements',
        vi: 'Hợp đồng & Thỏa thuận thương mại',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353848/lumen/vocabulary/topics/photo_1450133064473-71024230f91b.webp',
      },
      {
        en: 'Legal Compliance, Patents & Ethics',
        vi: 'Tuân thủ pháp luật & Đạo đức nghề',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353853/lumen/vocabulary/topics/photo_1589829545856-d10d557cf95f.webp',
      },
      {
        en: 'Recruitment & Talent Sourcing',
        vi: 'Tuyển dụng & Tìm kiếm nhân tài',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353853/lumen/vocabulary/topics/photo_1521737711867-e3b97375f902.webp',
      },
      {
        en: 'Compensation, Benefits & Training',
        vi: 'Lương thưởng, Phúc lợi & Đào tạo',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353873/lumen/vocabulary/topics/photo_1524178232363-1fb2b075b655.webp',
      },
      {
        en: 'Aviation, Transit & Travel Services',
        vi: 'Hàng không & Dịch vụ đi lại',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353865/lumen/vocabulary/topics/photo_1436491865332-7a61a109cc05.webp',
      },
      {
        en: 'Hotels, Hospitality & Event Catering',
        vi: 'Khách sạn, Lưu trú & Sự kiện',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353871/lumen/vocabulary/topics/photo_1566073771259-6a8506099945.webp',
      },
      {
        en: 'Digital Marketing & Brand Positioning',
        vi: 'Tiếp thị số & Định vị thương hiệu',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353877/lumen/vocabulary/topics/photo_1460925895917-afdab827c52f.webp',
      },
      {
        en: 'Office Tech, Software & IT Support',
        vi: 'Công nghệ công sở & Phần mềm',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353861/lumen/vocabulary/topics/photo_1558494949-ef010cbdcc31.webp',
      },
    ],
  },
  {
    id: 'nawl-academic',
    name: {
      en: 'Academic English',
      vi: 'Tiếng Anh học thuật',
    },
    category: {
      en: 'ESP & Academic English',
      vi: 'Tiếng Anh chuyên ngành',
    },
    description: {
      en: 'Essential academic vocabulary for IELTS and TOEFL reading and writing.',
      vi: 'Từ vựng học thuật dành cho luyện thi IELTS & TOEFL Reading/Writing.',
    },
    imageUrl:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353846/lumen/vocabulary/topics/photo_1521587760476-6c12a4b040da.webp',
    csvUrl: 'https://www.newgeneralservicelist.com/s/NAWL_12_stats.csv',
    defaultCefr: 'B2-C1',
    subTopics: [
      {
        en: 'Research Design & Hypotheses',
        vi: 'Thiết kế nghiên cứu & Giả thuyết',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353859/lumen/vocabulary/topics/photo_1456513080510-7bf3a84b82f8.webp',
      },
      {
        en: 'Laboratory Experiments & Measurement',
        vi: 'Thí nghiệm phòng lab & Đo lường',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353849/lumen/vocabulary/topics/photo_1532094349884-543bc11b234d.webp',
      },
      {
        en: 'Statistical Analysis & Quantitative Models',
        vi: 'Phân tích thống kê & Định lượng',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353850/lumen/vocabulary/topics/photo_1551288049-bebda4e38f71.webp',
      },
      {
        en: 'Qualitative Inquiry & Case Studies',
        vi: 'Nghiên cứu định tính & Thực địa',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353868/lumen/vocabulary/topics/photo_1434030216411-0b793f4b4173.webp',
      },
      {
        en: 'Theoretical Frameworks & Paradigms',
        vi: 'Khung lý thuyết & Hệ chuẩn',
        // Fresh image — replaced duplicate of NGSL Morals (1507413245164)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353858/lumen/vocabulary/topics/photo_1495592822108-9e6261896da8.webp',
      },
      {
        en: 'Abstract Concepts & Epistemology',
        vi: 'Khái niệm trừu tượng & Tri thức luận',
        // Fresh image — replaced duplicate of TSL Executive Leadership (1507679799987)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790354018/lumen/vocabulary/topics/topic_fallback_1790354017006.webp',
      },
      {
        en: 'Academic Rhetoric & Literature Synthesis',
        vi: 'Văn phong học thuật & Tổng quan tài liệu',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353859/lumen/vocabulary/topics/photo_1455390582262-044cdead277a.webp',
      },
      {
        en: 'Argumentation, Claims & Peer Review',
        vi: 'Biện luận, Luận điểm & Phản biện',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353848/lumen/vocabulary/topics/photo_1497633762265-9d179a990aa6.webp',
      },
      {
        en: 'Social Policy & Institutional Structures',
        vi: 'Chính sách xã hội & Cơ cấu thể chế',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353857/lumen/vocabulary/topics/photo_1517486808906-6ca8b3f04846.webp',
      },
      {
        en: 'Cognitive Psychology & Behavioral Science',
        vi: 'Tâm lý học nhận thức & Hành vi',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353868/lumen/vocabulary/topics/photo_1507676184212-d03ab07a01bf.webp',
      },
      {
        en: 'Ecology, Climate & Sustainability',
        vi: 'Sinh thái, Khí hậu & Phát triển bền vững',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353854/lumen/vocabulary/topics/photo_1473448912268-2022ce9509d8.jpg',
      },
      {
        en: 'Biomedical Science & Biotechnology',
        vi: 'Khoa học y sinh & Công nghệ sinh học',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353876/lumen/vocabulary/topics/photo_1579154204601-01588f351e67.webp',
      },
    ],
  },
  {
    id: 'bsl-business',
    name: {
      en: 'Business English',
      vi: 'Tiếng Anh thương mại',
    },
    category: {
      en: 'ESP & Academic English',
      vi: 'Tiếng Anh chuyên ngành',
    },
    description: {
      en: 'Corporate, finance, and office management vocabulary covering 97% of business texts.',
      vi: 'Từ vựng thương mại, tài chính & quản trị công sở bao phủ 97% tài liệu kinh doanh.',
    },
    imageUrl:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353844/lumen/vocabulary/topics/photo_1497366811353-6870744d04b2.webp',
    csvUrl: 'https://www.newgeneralservicelist.com/s/BSL_120_stats.csv',
    defaultCefr: 'B1-B2',
    subTopics: [
      {
        en: 'C-Suite Leadership & Corporate Strategy',
        vi: 'Lãnh đạo cấp cao & Chiến lược',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353854/lumen/vocabulary/topics/photo_1517048676732-d65bc937f952.webp',
      },
      {
        en: 'Business Transformation & Innovation',
        vi: 'Chuyển đổi mô hình & Đổi mới',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353868/lumen/vocabulary/topics/photo_1531482615713-2afd69097998.webp',
      },
      {
        en: 'Financial Reporting & Balance Sheets',
        vi: 'Báo cáo tài chính & Bảng cân đối',
        // Fresh image — replaced duplicate of TSL Accounting (1554224155)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353861/lumen/vocabulary/topics/photo_1543286386-713bdd548da4.webp',
      },
      {
        en: 'Corporate Finance & Equity Valuation',
        vi: 'Tài chính doanh nghiệp & Định giá',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353877/lumen/vocabulary/topics/photo_1559526324-4b87b5e36e44.webp',
      },
      {
        en: 'International Trade & Tariffs',
        vi: 'Thương mại quốc tế & Thuế quan',
        // Fresh image — replaced duplicate of TSL Freight (1578575437130)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353875/lumen/vocabulary/topics/photo_1519003300449-424ad0405076.jpg',
      },
      {
        en: 'Cross-Border Commerce & Logistics',
        vi: 'Giao dịch xuyên biên giới & Hàng hóa',
        // Fresh image — replaced duplicate of TSL Supply Chain (1586528116311)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353860/lumen/vocabulary/topics/photo_1494412574643-ff11b0a5c1c3.jpg',
      },
      {
        en: 'Manufacturing Operations & Throughput',
        vi: 'Vận hành sản xuất & Năng suất',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353869/lumen/vocabulary/topics/photo_1581091226825-a6a2a5aee158.webp',
      },
      {
        en: 'Quality Assurance & Lean Six Sigma',
        vi: 'Kiểm chuẩn chất lượng & Lean Six Sigma',
        // Fresh image — replaced duplicate of NDL Numbers (1581291518857)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353871/lumen/vocabulary/topics/photo_1504868584819-f8e8b4b6d7e3.webp',
      },
      {
        en: 'Client Prospecting & B2B Pitching',
        vi: 'Tìm kiếm khách hàng & Đấu thầu B2B',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353849/lumen/vocabulary/topics/photo_1556761175-5973dc0f32e7.webp',
      },
      {
        en: 'Contract Negotiations & Closing Deals',
        vi: 'Đàm phán hợp đồng & Chốt giao dịch',
        // Fresh image — replaced duplicate of TSL Contracts (1450133064473)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353870/lumen/vocabulary/topics/photo_1568992687947-868a62a9f521.webp',
      },
      {
        en: 'Brand Positioning & Corporate PR',
        vi: 'Định vị thương hiệu & Quan hệ công chúng',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353873/lumen/vocabulary/topics/photo_1533750349088-cd871a92f312.webp',
      },
      {
        en: 'Digital Marketing, CRM & Analytics',
        vi: 'Tiếp thị số, Quản trị CRM & Phân tích',
        // Fresh image — replaced duplicate of TSL Digital Marketing (1460925895917)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353863/lumen/vocabulary/topics/photo_1432888498266-38ffec3eaf0a.webp',
      },
      {
        en: 'Talent Sourcing & HR Management',
        vi: 'Săn tìm nhân tài & Quản trị nhân sự',
        // Fresh image — replaced duplicate of TSL Recruitment (1521737711867)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353873/lumen/vocabulary/topics/photo_1542744173-8e7e53415bb0.webp',
      },
      {
        en: 'Workplace Mediation & Labor Relations',
        vi: 'Hòa giải công sở & Quan hệ lao động',
        // Fresh image — replaced duplicates of NGSL Workplace (1522071820081) and NGSL-S Empathy (1573496359142)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353852/lumen/vocabulary/topics/photo_1531545514256-b1400bc00f31.webp',
      },
      {
        en: 'Corporate Law, IP & Patents',
        vi: 'Luật doanh nghiệp & Sở hữu trí tuệ',
        // Fresh image — replaced duplicate of TSL Legal Compliance (1589829545856)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353859/lumen/vocabulary/topics/photo_1575505586569-646b2ca898fc.webp',
      },
      {
        en: 'Regulatory Compliance & Risk Audit',
        vi: 'Tuân thủ quy định & Kiểm toán rủi ro',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353857/lumen/vocabulary/topics/photo_1486406146926-c627a92ad1ab.webp',
      },
    ],
  },
  {
    id: 'ngsl-spoken',
    name: {
      en: 'Spoken English',
      vi: 'Tiếng Anh đàm thoại',
    },
    category: {
      en: 'Communication & Spoken English',
      vi: 'Tiếng Anh giao tiếp',
    },
    description: {
      en: 'Priority conversational vocabulary for listening and speaking fluency.',
      vi: 'Từ vựng ưu tiên cho phản xạ nghe nói và đàm thoại hàng ngày.',
    },
    imageUrl:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353845/lumen/vocabulary/topics/photo_1517256064527-09c73fc73e38.webp',
    csvUrl: 'https://www.newgeneralservicelist.com/s/NGSL-Spoken_12_stats.csv',
    defaultCefr: 'A2-B1',
    subTopics: [
      {
        en: 'Casual Greetings & Social Openers',
        vi: 'Chào hỏi thân mật & Mở đầu câu chuyện',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353858/lumen/vocabulary/topics/photo_1521791136064-7986c2920216.webp',
      },
      {
        en: 'Parting Words & Polite Wrap-Ups',
        vi: 'Lời tạm biệt & Chúc tốt lành',
        // Fresh image — replaced duplicate of NGSL Family (1529156069898)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353854/lumen/vocabulary/topics/photo_1516979187457-637abb4f9353.webp',
      },
      {
        en: 'Spontaneous Reactions & Surprise',
        vi: 'Phản xạ tức thì & Bất ngờ',
        // Fresh image — replaced duplicate of NGSL Personality (1499209974431)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353859/lumen/vocabulary/topics/photo_1552674605-db6ffd4facb5.webp',
      },
      {
        en: 'Empathy, Comfort & Encouragement',
        vi: 'Thấu cảm, An ủi & Động viên',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353851/lumen/vocabulary/topics/photo_1573496359142-b8d87734a5a2.webp',
      },
      {
        en: 'Weekend Plans, Meetups & Coffee',
        vi: 'Hẹn hò, Gặp gỡ & Kế hoạch cuối tuần',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353868/lumen/vocabulary/topics/photo_1511632765486-a01980e01a18.webp',
      },
      {
        en: 'Accepting, Postponing & Declining',
        vi: 'Đồng ý, Hẹn lại & Từ chối khéo léo',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353877/lumen/vocabulary/topics/photo_1517248135467-4c7edcad34c4.webp',
      },
      {
        en: 'Asking for Directions & Guidance',
        vi: 'Hỏi thăm đường xá & Hướng đi',
        // Fresh image — replaced duplicate of NGSL City Landmarks (1488646953014)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353876/lumen/vocabulary/topics/photo_1476304884326-cd2c88572c5f.webp',
      },
      {
        en: 'Asking for Clarification & Repetition',
        vi: 'Hỏi lại cho rõ & Yêu cầu nhắc lại',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353866/lumen/vocabulary/topics/photo_1475721027785-f74eccf877e2.webp',
      },
      {
        en: 'Daily Anecdotes & Funny Moments',
        vi: 'Chuyện thường nhật & Khoảnh khắc vui',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353874/lumen/vocabulary/topics/photo_1517841905240-472988babdf9.webp',
      },
      {
        en: 'Childhood Memories & Past Stories',
        vi: 'Kỷ niệm thời thơ ấu & Kể chuyện xưa',
        // Fresh image — replaced duplicate of NGSL Morning Routines (1506784983877)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353859/lumen/vocabulary/topics/photo_1518398046578-8cca57782e17.webp',
      },
      {
        en: 'Tactful Pushbacks & Gentle Disagreement',
        vi: 'Bất đồng tế nhị & Góp ý nhẹ nhàng',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353870/lumen/vocabulary/topics/photo_1534528741775-53994a69daeb.webp',
      },
      {
        en: 'Consensus, Agreement & Wrapping Up',
        vi: 'Đạt được đồng thuận & Nhất trí',
        // Fresh image — replaced duplicate of BSL Client Prospecting (1556761175)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353859/lumen/vocabulary/topics/photo_1582213782179-e0d53f98f2ca.webp',
      },
    ],
  },
  {
    id: 'ndl-foundation',
    name: {
      en: 'Foundation English',
      vi: 'Tiếng Anh nền tảng',
    },
    category: {
      en: 'Core & Foundational English',
      vi: 'Từ vựng thông dụng & nền tảng',
    },
    description: {
      en: 'High-frequency starter vocabulary for absolute beginners and young learners.',
      vi: 'Bộ từ vựng cơ bản tần suất cao dành cho người mới bắt đầu.',
    },
    imageUrl:
      'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353844/lumen/vocabulary/topics/photo_1503676260728-1c00da094a0b.webp',
    csvUrl: 'https://www.newgeneralservicelist.com/s/NDL_11_stats.csv',
    defaultCefr: 'A1',
    subTopics: [
      {
        en: 'Primary Colors, Pigments & Light',
        vi: 'Màu sắc cơ bản, Sắc tố & Ánh sáng',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353851/lumen/vocabulary/topics/photo_1513542789411-b6a5d4f31634.webp',
      },
      {
        en: 'Shapes, Sizes & Measurements',
        vi: 'Hình khối, Kích cỡ & Đo lường',
        // Fresh image — replaced duplicate of NGSL Time (1509718443690)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353870/lumen/vocabulary/topics/photo_1564419320461-6870880221ad.webp',
      },
      {
        en: 'Numbers 1 to 20 & First Counting',
        vi: 'Con số 1 đến 20 & Đếm số căn bản',
        // Fresh image — replaced duplicate of BSL Quality Assurance (1581291518857)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353865/lumen/vocabulary/topics/photo_1606326608690-4e0281b1e588.webp',
      },
      {
        en: 'Clock Time, Days & Seasons',
        vi: 'Thời gian, Các ngày & Mùa trong năm',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353863/lumen/vocabulary/topics/photo_1495365200479-c4ed1d35e1aa.webp',
      },
      {
        en: 'Family Members & Loving Home',
        vi: 'Gia đình yêu thương & Người thân',
        // Fresh image — replaced duplicate of NGSL Home Living (1513151233558)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353873/lumen/vocabulary/topics/photo_1609220136736-443140cffec6.webp',
      },
      {
        en: 'Rooms, Beds & Cozy House',
        vi: 'Phòng ốc, Giường ngủ & Nhà ấm cúng',
        // Fresh image — replaced duplicate of NGSL Morning Routines (1506784983877)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353870/lumen/vocabulary/topics/photo_1555041469-a586c61ea9bc.webp',
      },
      {
        en: 'Pets, Farm Animals & Gentle Creatures',
        vi: 'Thú cưng, Vật nuôi & Muông thú',
        // Fresh image — replaced duplicate of NGSL Flora/Fauna (1474511320723)
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353850/lumen/vocabulary/topics/photo_1425082661705-1834bfd09dca.webp',
      },
      {
        en: 'Birds, Wild Animals & Ocean Life',
        vi: 'Chim trời, Thú hoang & Biển cả',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353845/lumen/vocabulary/topics/photo_1534188753412-3e26d0d618d6.jpg',
      },
      {
        en: 'Toys, Playgrounds & Outdoor Games',
        vi: 'Đồ chơi, Sân chơi & Vui chơi ngoài trời',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353856/lumen/vocabulary/topics/photo_1472162072942-cd5147eb3902.webp',
      },
      {
        en: 'Daily Actions & Kind Helping Hands',
        vi: 'Hành động thường ngày & Giúp đỡ',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353858/lumen/vocabulary/topics/photo_1485546246426-74dc88dec4d9.webp',
      },
      {
        en: 'Healthy Food, Fruits & Sweet Milk',
        vi: 'Đồ ăn tươi ngon, Trái cây & Sữa',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353866/lumen/vocabulary/topics/photo_1542291026-7eec264c27ff.webp',
      },
      {
        en: 'Clothes, Shoes & Sunny Weather',
        vi: 'Quần áo, Giày dép & Thời tiết',
        imageUrl:
          'https://res.cloudinary.com/dms9jruo5/image/upload/v1790353847/lumen/vocabulary/topics/photo_1515886657613-9f3515b0c78f.webp',
      },
    ],
  },
];

export function inferCefrLevel(rank: number): string {
  if (rank <= 1000) return 'A1';
  if (rank <= 2000) return 'A2';
  if (rank <= 3000) return 'B1';
  if (rank <= 4500) return 'B2';
  return 'C1';
}

export function assignSubTopic(
  datasetConfig: NgslDatasetConfig,
  index: number,
  totalRows: number = 1000,
): SubTopicConfig {
  const subTopics = datasetConfig.subTopics;
  if (!subTopics || subTopics.length === 0) {
    return {
      en: datasetConfig.category.en,
      vi: datasetConfig.category.vi,
      imageUrl:
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&auto=format&fit=crop&q=80',
    };
  }
  const itemsPerTopic = Math.max(1, Math.ceil(totalRows / subTopics.length));
  const targetIdx = Math.min(
    Math.floor(index / itemsPerTopic),
    subTopics.length - 1,
  );
  return subTopics[targetIdx];
}
