import axios from 'axios';
import { useEffect, useState } from 'react';
import Clipboard from 'clipboard';
import { useNavigate } from 'react-router-dom';
import { Loading, Input } from '@/components';

// api source: https://emoji-api.com/

interface EmojiData {
  slug: string;
  character: string;
  unicodeName: string;
  codePoint: string;
  group: string;
  subGroup: string;
}

const getUniqueGroups = (data: EmojiData[]): string[] => {
  const uniqueGroups = new Set<string>();
  data.forEach((item) => {
    if (item.group) uniqueGroups.add(item.group);
  });
  return Array.from(uniqueGroups);
};

const EmojiPage = (): React.ReactNode => {
  const [result, setResult] = useState<EmojiData[]>([]);
  const [typeFilterList, setTypeFilterList] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const goToPosts = (data: string) =>
    navigate({ pathname: '/emoji', search: `?data=${data}` });

  const getEmoji = async (e?: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const data = e?.target.value || '';
    setTypeFilter('');
    goToPosts(data);
    axios
      // 這個 api 掛了！！！
      .get('https://emoji-api.com/emojis', {
        params: {
          search: data,
          access_key: '11698457883fe881f5ae1d05a58e25565bba420b',
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res.data?.status === 'error') {
          setResult([]);
          return;
        }
        setResult(res.data);
        setTypeFilterList(getUniqueGroups(res.data));
      });
  };

  useEffect(() => {
    const clipboard = new Clipboard('.copy-to-clipboard');
    getEmoji();
    return () => clipboard.destroy();
  }, []);

  return (
    <div className="mx-auto flex min-h-main w-full max-w-[768px] flex-col space-y-lg">
      <h1 className="title-2xl">Emoji Api</h1>

      <div className="flex flex-1 flex-col">
        <Input
          className="mb-lg"
          inputSize="large"
          placeholder="搜尋 emoji..."
          onChange={getEmoji}
        />

        {isLoading ? (
          <div className="py-2xl">
            <Loading size="large" />
          </div>
        ) : (
          <>
            {/* 類型過濾 */}
            <div className="mb-lg flex flex-wrap gap-sm">
              {typeFilterList.map((type, index) => (
                <button
                  className={`cursor-pointer rounded-md border border-outline px-sm py-xs text-sm transition-colors hover:overlay-2 ${
                    typeFilter === type ? 'bg-surface-4 font-bold' : ''
                  }`}
                  key={index}
                  onClick={() => setTypeFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* 結果表格 */}
            <div className="overflow-auto rounded-lg border border-outline-2">
              <table className="min-w-full divide-y divide-outline-2">
                <thead className="sticky top-0 bg-surface-3">
                  <tr>
                    <th scope="col" className="whitespace-nowrap px-lg py-sm text-left font-bold">
                      character
                    </th>
                    <th scope="col" className="whitespace-nowrap px-lg py-sm text-left font-bold">
                      group
                    </th>
                    <th scope="col" className="whitespace-nowrap px-lg py-sm text-left font-bold">
                      slug
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-2">
                  {result.length > 0 &&
                    result
                      .filter((item) =>
                        typeFilter ? item.group === typeFilter : true,
                      )
                      .map((emoji) => (
                        <tr
                          className="copy-to-clipboard group cursor-pointer transition-colors hover:bg-surface-3"
                          key={emoji.slug}
                          data-clipboard-text={emoji.character}
                          onClick={() => console.log(`${emoji.character} copied`)}
                        >
                          <td className="whitespace-nowrap bg-surface-1 px-md py-sm group-hover:bg-surface-3">
                            <span className="text-2xl">{emoji.character}</span>
                          </td>
                          <td className="whitespace-nowrap bg-surface-1 px-md py-sm text-on-surface-variant group-hover:bg-surface-3">
                            {emoji.group}
                          </td>
                          <td className="whitespace-nowrap bg-surface-1 px-md py-sm text-on-surface-variant group-hover:bg-surface-3">
                            {emoji.slug}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmojiPage;
