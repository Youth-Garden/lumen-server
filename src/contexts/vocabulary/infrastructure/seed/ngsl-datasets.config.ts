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
      en: 'General English',
      vi: 'Tiếng Anh giao tiếp',
    },
    description: {
      en: 'Foundational core vocabulary covering ~92% of standard English texts.',
      vi: 'Bộ từ vựng cốt lõi bao phủ 92% nội dung tiếng Anh thông dụng.',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    csvUrl: 'https://www.newgeneralservicelist.com/s/NGSL_12_stats.csv',
    defaultCefr: 'A1-A2',
    subTopics: [
      {
        en: 'Family, Friends & Social Bonds',
        vi: 'Gia đình, Bạn bè & Gắn kết',
        imageUrl:
          'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Human Personality & Character',
        vi: 'Tính cách, Phẩm chất & Tâm trạng',
        imageUrl:
          'https://images.unsplash.com/photo-1499209974431-9dac3cea0047?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Morning Habits & Domestic Routines',
        vi: 'Thói quen buổi sáng & Sinh hoạt',
        imageUrl:
          'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Home Living, Furniture & Chores',
        vi: 'Nhà cửa, Nội thất & Việc nhà',
        imageUrl:
          'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Cooking, Kitchen Tools & Recipes',
        vi: 'Nấu nướng, Dụng cụ bếp & Công thức',
        imageUrl:
          'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Groceries, Flavors & Eating Out',
        vi: 'Thực phẩm, Hương vị & Ăn ngoài',
        imageUrl:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'City Landmarks & Public Spaces',
        vi: 'Địa danh đô thị & Không gian chung',
        imageUrl:
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Commuting, Vehicles & Transit',
        vi: 'Đi lại, Phương tiện & Giao thông',
        imageUrl:
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Jobs, Professions & Occupations',
        vi: 'Nghề nghiệp, Việc làm & Chuyên môn',
        imageUrl:
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Workplace Tasks & Coworkers',
        vi: 'Công việc văn phòng & Đồng nghiệp',
        imageUrl:
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'School Life, Classrooms & Subjects',
        vi: 'Đời sống học đường & Môn học',
        imageUrl:
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Libraries, Exams & Self-Study',
        vi: 'Thư viện, Thi cử & Tự học',
        // Fresh image — replaced duplicate of NAWL Research Design (1456513080510)
        imageUrl:
          'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Body, Physical Health & Medicine',
        vi: 'Cơ thể, Sức khỏe & Y tế',
        imageUrl:
          'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Fitness, Athletics & Outdoor Sports',
        vi: 'Thể hình, Thể thao & Vận động',
        imageUrl:
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Digital Devices, Apps & Hardware',
        vi: 'Thiết bị số & Ứng dụng điện thoại',
        imageUrl:
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Social Media & Online Communication',
        vi: 'Mạng xã hội & Đời sống online',
        imageUrl:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Seasons, Weather & Landscapes',
        vi: 'Mùa, Kiểu thời tiết & Cảnh quan',
        imageUrl:
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Flora, Fauna & Animal Kingdom',
        vi: 'Động thực vật & Muông thú',
        imageUrl:
          'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Cinema, Theater & Films',
        vi: 'Điện ảnh & Nghệ thuật sân khấu',
        imageUrl:
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Music, Instruments & Fine Arts',
        vi: 'Âm nhạc, Nhạc cụ & Hội họa',
        imageUrl:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Holidays, Festivals & Celebrations',
        vi: 'Ngày lễ, Lễ hội & Văn hóa',
        imageUrl:
          'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Civic Services, Community & Law',
        vi: 'Dịch vụ công dân, Pháp luật & Đô thị',
        imageUrl:
          'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Time, Probability & Reason',
        vi: 'Thời gian, Xác suất & Suy luận',
        imageUrl:
          'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Morals, Values & Philosophical Thoughts',
        vi: 'Đạo đức, Giá trị & Tư tưởng',
        imageUrl:
          'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&auto=format&fit=crop&q=80',
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
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    csvUrl: 'https://www.newgeneralservicelist.com/s/TSL_12_stats.csv',
    defaultCefr: 'B1-B2',
    subTopics: [
      {
        en: 'Executive Leadership & Strategy',
        vi: 'Lãnh đạo & Chiến lược điều hành',
        imageUrl:
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Corporate Governance & Policy',
        vi: 'Quản trị doanh nghiệp & Chính sách',
        imageUrl:
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Banking Operations & Accounts',
        vi: 'Nghiệp vụ ngân hàng & Tài khoản',
        imageUrl:
          'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Investment & Capital Markets',
        vi: 'Đầu tư & Thị trường vốn',
        imageUrl:
          'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Accounting, Tax & Fiscal Auditing',
        vi: 'Kế toán, Thuế & Kiểm toán',
        imageUrl:
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Financial Risk & Asset Management',
        vi: 'Quản lý rủi ro & Tài sản',
        imageUrl:
          'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Supply Chain & Warehousing',
        vi: 'Chuỗi cung ứng & Kho bãi',
        imageUrl:
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Freight, Shipping & Customs',
        vi: 'Vận tải hàng hóa & Hải quan',
        imageUrl:
          'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Contracts & Business Agreements',
        vi: 'Hợp đồng & Thỏa thuận thương mại',
        imageUrl:
          'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Legal Compliance, Patents & Ethics',
        vi: 'Tuân thủ pháp luật & Đạo đức nghề',
        imageUrl:
          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Recruitment & Talent Sourcing',
        vi: 'Tuyển dụng & Tìm kiếm nhân tài',
        imageUrl:
          'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Compensation, Benefits & Training',
        vi: 'Lương thưởng, Phúc lợi & Đào tạo',
        imageUrl:
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Aviation, Transit & Travel Services',
        vi: 'Hàng không & Dịch vụ đi lại',
        imageUrl:
          'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Hotels, Hospitality & Event Catering',
        vi: 'Khách sạn, Lưu trú & Sự kiện',
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Digital Marketing & Brand Positioning',
        vi: 'Tiếp thị số & Định vị thương hiệu',
        imageUrl:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Office Tech, Software & IT Support',
        vi: 'Công nghệ công sở & Phần mềm',
        imageUrl:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
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
      en: 'Academic English',
      vi: 'Tiếng Anh học thuật',
    },
    description: {
      en: 'Essential academic vocabulary for IELTS and TOEFL reading and writing.',
      vi: 'Từ vựng học thuật dành cho luyện thi IELTS & TOEFL Reading/Writing.',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
    csvUrl: 'https://www.newgeneralservicelist.com/s/NAWL_12_stats.csv',
    defaultCefr: 'B2-C1',
    subTopics: [
      {
        en: 'Research Design & Hypotheses',
        vi: 'Thiết kế nghiên cứu & Giả thuyết',
        imageUrl:
          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Laboratory Experiments & Measurement',
        vi: 'Thí nghiệm phòng lab & Đo lường',
        imageUrl:
          'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Statistical Analysis & Quantitative Models',
        vi: 'Phân tích thống kê & Định lượng',
        imageUrl:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Qualitative Inquiry & Case Studies',
        vi: 'Nghiên cứu định tính & Thực địa',
        imageUrl:
          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Theoretical Frameworks & Paradigms',
        vi: 'Khung lý thuyết & Hệ chuẩn',
        // Fresh image — replaced duplicate of NGSL Morals (1507413245164)
        imageUrl:
          'https://images.unsplash.com/photo-1495592822108-9e6261896da8?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Abstract Concepts & Epistemology',
        vi: 'Khái niệm trừu tượng & Tri thức luận',
        // Fresh image — replaced duplicate of TSL Executive Leadership (1507679799987)
        imageUrl:
          'https://images.unsplash.com/photo-1516796181074-bf453b562e1f?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Academic Rhetoric & Literature Synthesis',
        vi: 'Văn phong học thuật & Tổng quan tài liệu',
        imageUrl:
          'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Argumentation, Claims & Peer Review',
        vi: 'Biện luận, Luận điểm & Phản biện',
        imageUrl:
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Social Policy & Institutional Structures',
        vi: 'Chính sách xã hội & Cơ cấu thể chế',
        imageUrl:
          'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Cognitive Psychology & Behavioral Science',
        vi: 'Tâm lý học nhận thức & Hành vi',
        imageUrl:
          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Ecology, Climate & Sustainability',
        vi: 'Sinh thái, Khí hậu & Phát triển bền vững',
        imageUrl:
          'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Biomedical Science & Biotechnology',
        vi: 'Khoa học y sinh & Công nghệ sinh học',
        imageUrl:
          'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
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
      en: 'Business English',
      vi: 'Tiếng Anh thương mại',
    },
    description: {
      en: 'Corporate, finance, and office management vocabulary covering 97% of business texts.',
      vi: 'Từ vựng thương mại, tài chính & quản trị công sở bao phủ 97% tài liệu kinh doanh.',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
    csvUrl: 'https://www.newgeneralservicelist.com/s/BSL_120_stats.csv',
    defaultCefr: 'B1-B2',
    subTopics: [
      {
        en: 'C-Suite Leadership & Corporate Strategy',
        vi: 'Lãnh đạo cấp cao & Chiến lược',
        imageUrl:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Business Transformation & Innovation',
        vi: 'Chuyển đổi mô hình & Đổi mới',
        imageUrl:
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Financial Reporting & Balance Sheets',
        vi: 'Báo cáo tài chính & Bảng cân đối',
        // Fresh image — replaced duplicate of TSL Accounting (1554224155)
        imageUrl:
          'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Corporate Finance & Equity Valuation',
        vi: 'Tài chính doanh nghiệp & Định giá',
        imageUrl:
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'International Trade & Tariffs',
        vi: 'Thương mại quốc tế & Thuế quan',
        // Fresh image — replaced duplicate of TSL Freight (1578575437130)
        imageUrl:
          'https://images.unsplash.com/photo-1519003300449-424ad0405076?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Cross-Border Commerce & Logistics',
        vi: 'Giao dịch xuyên biên giới & Hàng hóa',
        // Fresh image — replaced duplicate of TSL Supply Chain (1586528116311)
        imageUrl:
          'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Manufacturing Operations & Throughput',
        vi: 'Vận hành sản xuất & Năng suất',
        imageUrl:
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Quality Assurance & Lean Six Sigma',
        vi: 'Kiểm chuẩn chất lượng & Lean Six Sigma',
        // Fresh image — replaced duplicate of NDL Numbers (1581291518857)
        imageUrl:
          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Client Prospecting & B2B Pitching',
        vi: 'Tìm kiếm khách hàng & Đấu thầu B2B',
        imageUrl:
          'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Contract Negotiations & Closing Deals',
        vi: 'Đàm phán hợp đồng & Chốt giao dịch',
        // Fresh image — replaced duplicate of TSL Contracts (1450133064473)
        imageUrl:
          'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Brand Positioning & Corporate PR',
        vi: 'Định vị thương hiệu & Quan hệ công chúng',
        imageUrl:
          'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Digital Marketing, CRM & Analytics',
        vi: 'Tiếp thị số, Quản trị CRM & Phân tích',
        // Fresh image — replaced duplicate of TSL Digital Marketing (1460925895917)
        imageUrl:
          'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Talent Sourcing & HR Management',
        vi: 'Săn tìm nhân tài & Quản trị nhân sự',
        // Fresh image — replaced duplicate of TSL Recruitment (1521737711867)
        imageUrl:
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Workplace Mediation & Labor Relations',
        vi: 'Hòa giải công sở & Quan hệ lao động',
        // Fresh image — replaced duplicates of NGSL Workplace (1522071820081) and NGSL-S Empathy (1573496359142)
        imageUrl:
          'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Corporate Law, IP & Patents',
        vi: 'Luật doanh nghiệp & Sở hữu trí tuệ',
        // Fresh image — replaced duplicate of TSL Legal Compliance (1589829545856)
        imageUrl:
          'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Regulatory Compliance & Risk Audit',
        vi: 'Tuân thủ quy định & Kiểm toán rủi ro',
        imageUrl:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
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
      en: 'Spoken English',
      vi: 'Tiếng Anh đàm thoại',
    },
    description: {
      en: 'Priority conversational vocabulary for listening and speaking fluency.',
      vi: 'Từ vựng ưu tiên cho phản xạ nghe nói và đàm thoại hàng ngày.',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
    csvUrl: 'https://www.newgeneralservicelist.com/s/NGSL-Spoken_12_stats.csv',
    defaultCefr: 'A2-B1',
    subTopics: [
      {
        en: 'Casual Greetings & Social Openers',
        vi: 'Chào hỏi thân mật & Mở đầu câu chuyện',
        imageUrl:
          'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Parting Words & Polite Wrap-Ups',
        vi: 'Lời tạm biệt & Chúc tốt lành',
        // Fresh image — replaced duplicate of NGSL Family (1529156069898)
        imageUrl:
          'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Spontaneous Reactions & Surprise',
        vi: 'Phản xạ tức thì & Bất ngờ',
        // Fresh image — replaced duplicate of NGSL Personality (1499209974431)
        imageUrl:
          'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Empathy, Comfort & Encouragement',
        vi: 'Thấu cảm, An ủi & Động viên',
        imageUrl:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Weekend Plans, Meetups & Coffee',
        vi: 'Hẹn hò, Gặp gỡ & Kế hoạch cuối tuần',
        imageUrl:
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Accepting, Postponing & Declining',
        vi: 'Đồng ý, Hẹn lại & Từ chối khéo léo',
        imageUrl:
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Asking for Directions & Guidance',
        vi: 'Hỏi thăm đường xá & Hướng đi',
        // Fresh image — replaced duplicate of NGSL City Landmarks (1488646953014)
        imageUrl:
          'https://images.unsplash.com/photo-1476304884326-cd2c88572c5f?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Asking for Clarification & Repetition',
        vi: 'Hỏi lại cho rõ & Yêu cầu nhắc lại',
        imageUrl:
          'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Daily Anecdotes & Funny Moments',
        vi: 'Chuyện thường nhật & Khoảnh khắc vui',
        imageUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Childhood Memories & Past Stories',
        vi: 'Kỷ niệm thời thơ ấu & Kể chuyện xưa',
        // Fresh image — replaced duplicate of NGSL Morning Routines (1506784983877)
        imageUrl:
          'https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Tactful Pushbacks & Gentle Disagreement',
        vi: 'Bất đồng tế nhị & Góp ý nhẹ nhàng',
        imageUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Consensus, Agreement & Wrapping Up',
        vi: 'Đạt được đồng thuận & Nhất trí',
        // Fresh image — replaced duplicate of BSL Client Prospecting (1556761175)
        imageUrl:
          'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=80',
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
      en: 'Foundation English',
      vi: 'Tiếng Anh nền tảng',
    },
    description: {
      en: 'High-frequency starter vocabulary for absolute beginners and young learners.',
      vi: 'Bộ từ vựng cơ bản tần suất cao dành cho người mới bắt đầu.',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    csvUrl: 'https://www.newgeneralservicelist.com/s/NDL_11_stats.csv',
    defaultCefr: 'A1',
    subTopics: [
      {
        en: 'Primary Colors, Pigments & Light',
        vi: 'Màu sắc cơ bản, Sắc tố & Ánh sáng',
        imageUrl:
          'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Shapes, Sizes & Measurements',
        vi: 'Hình khối, Kích cỡ & Đo lường',
        // Fresh image — replaced duplicate of NGSL Time (1509718443690)
        imageUrl:
          'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Numbers 1 to 20 & First Counting',
        vi: 'Con số 1 đến 20 & Đếm số căn bản',
        // Fresh image — replaced duplicate of BSL Quality Assurance (1581291518857)
        imageUrl:
          'https://images.unsplash.com/photo-1606326608690-4e0281b1e588?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Clock Time, Days & Seasons',
        vi: 'Thời gian, Các ngày & Mùa trong năm',
        imageUrl:
          'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Family Members & Loving Home',
        vi: 'Gia đình yêu thương & Người thân',
        // Fresh image — replaced duplicate of NGSL Home Living (1513151233558)
        imageUrl:
          'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Rooms, Beds & Cozy House',
        vi: 'Phòng ốc, Giường ngủ & Nhà ấm cúng',
        // Fresh image — replaced duplicate of NGSL Morning Routines (1506784983877)
        imageUrl:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Pets, Farm Animals & Gentle Creatures',
        vi: 'Thú cưng, Vật nuôi & Muông thú',
        // Fresh image — replaced duplicate of NGSL Flora/Fauna (1474511320723)
        imageUrl:
          'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Birds, Wild Animals & Ocean Life',
        vi: 'Chim trời, Thú hoang & Biển cả',
        imageUrl:
          'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Toys, Playgrounds & Outdoor Games',
        vi: 'Đồ chơi, Sân chơi & Vui chơi ngoài trời',
        imageUrl:
          'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Daily Actions & Kind Helping Hands',
        vi: 'Hành động thường ngày & Giúp đỡ',
        imageUrl:
          'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Healthy Food, Fruits & Sweet Milk',
        vi: 'Đồ ăn tươi ngon, Trái cây & Sữa',
        imageUrl:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      },
      {
        en: 'Clothes, Shoes & Sunny Weather',
        vi: 'Quần áo, Giày dép & Thời tiết',
        imageUrl:
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
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
