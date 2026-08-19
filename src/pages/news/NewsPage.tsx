import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../components/AppShell';
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
    <AppShell currentPageLabel="뉴스 상세보기">
      <main className="grid min-h-[650px] w-full flex-1 grid-cols-[minmax(620px,2fr)_minmax(420px,1fr)] gap-[23px] px-7 py-9 font-[Pretendard,system-ui,sans-serif] text-[#2b2b2b] max-[1450px]:px-1 max-[1450px]:py-4">
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
      </main>
    </AppShell>
  );
}

function CompanyTag({ children }: { children: string }) {
  return (
    <span className="inline-flex min-h-[21px] items-center rounded-lg bg-[#bde8f2] px-2 py-[3px] text-[10px] font-medium whitespace-nowrap text-[#0f59a3]">
      {children}
    </span>
  );
}
