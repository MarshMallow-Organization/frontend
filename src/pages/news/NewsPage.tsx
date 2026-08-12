import { useEffect, useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuRounded from '@mui/icons-material/MenuRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import { BaseCard } from '../../components/BaseCard';
import { SearchField } from '../../components/SearchField';
import {
  getNews,
  type NewsArticle,
  type NewsCategory,
} from '../../features/news/newsApi';
import heroImage from '../../assets/news/raw-image-3.png';

const filters: { label: string; value: NewsCategory | 'it' | 'politics' }[] = [
  { label: '전체', value: 'all' },
  { label: '인기뉴스', value: 'popular' },
  { label: '경제', value: 'economic' },
  // TODO: 뉴스 카테고리 목록은 백엔드 정책에 따라 변경될 수 있습니다.
  { label: 'IT/과학', value: 'it' },
  { label: '정치', value: 'politics' },
];

export default function NewsPage() {
  const pathCategory: NewsCategory = window.location.pathname.includes(
    '/popular',
  )
    ? 'popular'
    : window.location.pathname.includes('/economic')
      ? 'economic'
      : 'all';
  const [category, setCategory] = useState<NewsCategory>(pathCategory);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selected, setSelected] = useState<NewsArticle | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    void getNews(category)
      .then((data) => {
        setArticles(data);
        setSelected((current) => current ?? data[0] ?? null);
      })
      .catch(() => setArticles([]));
  }, [category]);

  const visibleArticles = useMemo(
    () =>
      articles.filter((article) =>
        `${article.company} ${article.title}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [articles, query],
  );

  const changeCategory = (next: NewsCategory) => {
    setCategory(next);
    window.history.replaceState(
      null,
      '',
      next === 'all' ? '/news' : `/news/${next}`,
    );
  };

  return (
    <main className="min-h-screen min-w-[1120px] bg-[#e9eff3] font-[Pretendard,system-ui,sans-serif] text-[#2b2b2b]">
      <header className="grid h-[166px] grid-cols-[120px_55px_1fr_316px_48px_56px] items-center gap-6 px-16 pl-[84px] max-[1450px]:grid-cols-[80px_55px_1fr_280px_44px_55px] max-[1450px]:gap-3.5 max-[1450px]:px-11">
        <div className="text-[21px] leading-[.8] font-black tracking-[-1px] text-[#42576c]">
          Marsh
          <br />
          Mallow
        </div>
        <IconButton className="!h-[55px] !w-[55px] !p-0" aria-label="홈">
          <img className="block h-[55px] w-[55px]" src="/homepage.svg" alt="" />
        </IconButton>
        <nav
          className="flex items-center gap-2.5 justify-self-start rounded-[30px] bg-[rgba(218,223,227,.6)] px-[15px] py-[9px] shadow-[0_0_3px_rgba(0,0,0,.3)]"
          aria-label="주요 메뉴"
        >
          {['Label', 'Label', 'Label', 'Label'].map((label, index) => (
            <span
              className="grid h-10 place-items-center rounded-[24px] bg-[#f2f3f4] px-[22px] text-[15px] whitespace-nowrap text-[rgba(72,73,73,.8)]"
              key={index}
            >
              {label}
            </span>
          ))}
          <i className="h-[42px] w-px bg-[#aab6be]" />
          <strong className="grid h-10 place-items-center rounded-[24px] bg-white px-[22px] text-[15px] font-bold whitespace-nowrap text-[#2fc4d1]">
            뉴스 상세보기
          </strong>
        </nav>
        <SearchField
          placeholder="관심있는 종목을 검색해보세요."
          sx={{
            width: 'clamp(280px, 16.46vw, 316px)',
            '& .MuiOutlinedInput-root': {
              height: 43,
              boxShadow: '0 0 7px -2px rgba(15,89,163,.27)',
            },
            '& .MuiOutlinedInput-input': {
              paddingTop: '11px',
              paddingBottom: '11px',
              fontSize: '13px',
            },
            '& .MuiSvgIcon-root': { fontSize: 18 },
          }}
        />
        <IconButton aria-label="메뉴">
          <MenuRounded />
        </IconButton>
        <IconButton
          className="!h-[55px] !w-[55px] !bg-[#c8d9e4] !text-white"
          aria-label="프로필"
        >
          <PersonRounded sx={{ width: 38, height: 38 }} />
        </IconButton>
      </header>

      <section className="relative mx-9 mb-9 h-[calc(100vh-202px)] min-h-[650px] overflow-hidden rounded-[45px] bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_112%,rgba(96,225,255,.38)_0,rgba(139,196,255,.2)_22%,transparent_45%),radial-gradient(circle_at_91%_76%,rgba(126,255,249,.42)_0,rgba(208,255,253,.26)_28%,transparent_52%)]"
        />
        <div className="relative z-10 grid h-full grid-cols-[minmax(620px,2fr)_minmax(420px,1fr)] gap-[23px] px-12 py-[59px] max-[1450px]:px-6 max-[1450px]:py-10">
          <BaseCard className="!overflow-hidden !rounded-[20px] !border-[#dedede] !bg-white !p-0 !shadow-[0_0_3px_rgba(0,0,0,.3)]">
            {selected && (
              <article className="h-full overflow-y-auto px-10 pt-[38px] pb-[60px]">
                <div className="flex items-center gap-3 text-[13px] text-[#696969]">
                  <CompanyTag>{selected.company}</CompanyTag>
                  <span>
                    {selected.publishedAt} ・ {selected.source}
                  </span>
                </div>
                <h1 className="my-2.5 mb-4 text-[clamp(20px,1.48vw,28px)] leading-[1.3] font-medium text-black">
                  {selected.title}
                </h1>
                <img
                  className="block h-[300px] w-full rounded-[10px] object-cover object-[center_43%]"
                  src={selected.imageUrl ? heroImage : heroImage}
                  alt="루시드 사옥"
                />
                <div className="mx-auto mt-[29px] max-w-[999px] text-lg leading-[2.3] font-light tracking-[-.6px] text-black">
                  {selected.content.map((paragraph, index) => (
                    <p className="mb-2" key={index}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            )}
          </BaseCard>

          <BaseCard className="!flex !flex-col !overflow-hidden !rounded-[20px] !border-[#dedede] !bg-white !p-0 !shadow-[0_0_3px_rgba(0,0,0,.3)]">
            <div className="z-[1] shrink-0 basis-[152px] bg-white px-[29px] pt-[29px] pb-[7px]">
              <SearchField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="뉴스를 검색하세요."
                sx={{
                  '& .MuiOutlinedInput-root': { height: 51 },
                  '& .MuiOutlinedInput-input': { fontSize: '16px' },
                }}
              />
              <div className="mt-6 flex gap-2">
                {filters.map((filter) => {
                  const enabled =
                    filter.value === 'all' ||
                    filter.value === 'popular' ||
                    filter.value === 'economic';
                  return (
                    <button
                      key={filter.value}
                      disabled={!enabled}
                      className={`h-10 cursor-pointer rounded-[50px] border px-[22px] font-[Pretendard,sans-serif] text-sm font-medium whitespace-nowrap max-[1450px]:px-3.5 ${category === filter.value ? 'border-[#11acd0] bg-[#11acd0] font-bold text-white' : 'border-[#c6c6c6] bg-white text-[#b1b1b1]'} disabled:cursor-not-allowed disabled:opacity-65`}
                      onClick={() =>
                        enabled && changeCategory(filter.value as NewsCategory)
                      }
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="overflow-y-auto px-[22px] pt-[7px] pb-6">
              {visibleArticles.map((article) => (
                <button
                  className={`flex min-h-[115px] w-full cursor-pointer items-center gap-4 rounded-[15px] border-[.5px] p-[18px] text-left ${selected?.id === article.id ? 'border-[#e1e1e1] bg-[#f3faff]' : 'border-transparent bg-transparent'}`}
                  key={article.id}
                  onClick={() => setSelected(article)}
                >
                  <span className="h-[76px] w-[76px] shrink-0 rounded-[10px] bg-[#d9d9d9]" />
                  <span className="flex min-w-0 flex-col gap-3">
                    <span className="flex items-center gap-1.5">
                      <CompanyTag>{article.company}</CompanyTag>
                      <small className="text-[8px] text-[#9b9b9b]">
                        {article.source} · {article.publishedAt}
                      </small>
                    </span>
                    <span className="text-[13px] leading-[1.4] text-black">
                      {article.title}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </BaseCard>
        </div>
      </section>
    </main>
  );
}

function CompanyTag({ children }: { children: string }) {
  return (
    <span className="inline-flex min-h-[21px] items-center rounded-lg bg-[#bde8f2] px-2 py-[3px] text-[10px] font-medium whitespace-nowrap text-[#0f59a3]">
      {children}
    </span>
  );
}
