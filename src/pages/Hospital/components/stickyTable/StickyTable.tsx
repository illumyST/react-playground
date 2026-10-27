import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/utils/classnames';

import ExpandToggleButton from './ExpandToggleButton';

export type StickyTableColumn<TRow> = {
  key: string;
  header: string;
  width: string;
  isSticky?: boolean;
  render: (row: TRow) => React.ReactNode;
};

export type StickySubContentContext = {
  /** 子表格 Header 應使用的 sticky top（外層 Header + 父列高度），直接傳給子表格的 stickyTopOffset。 */
  stickyTopOffset: string;
};

type StickyTableProps<TRow extends { id: string }> = {
  rows: TRow[];
  columns: StickyTableColumn<TRow>[];
  renderSubContent?: (row: TRow, context: StickySubContentContext) => React.ReactNode;
  /** 是否為巢狀子表格。若為 true，不會建立獨立的滾動容器，以繼承父層的 scroll context。 */
  isSubTable?: boolean;
  /** 外層 Header 的 sticky top 基準位置，預設 '0px'。 */
  stickyTopOffset?: string;
};

type DisplayColumn<TRow> = StickyTableColumn<TRow> & {
  leftOffset?: string;
  skipOverflow: boolean;
};

const STICKY_COLUMN_SHADOW = '1px 0 0 rgba(0,0,0,0.08)';
const HEADER_SHADOW = '0 1px 0 rgba(0,0,0,0.08)';
const STICKY_ROW_SHADOW = '0 2px 4px rgba(0,0,0,0.06)';

/**
 * 外層與子表格共用同一個 stacking context，所以 z-index 需整體規劃：
 * 外層 Header > 展開中的父列 > 子表格 Header > 一般 sticky 欄位。
 * 子表格 Header 被推出時會往上滑，必須壓在父列底下，否則會蓋住父列。
 */
const Z_INDEX = {
  header: { sticky: 7, normal: 6 },
  stuckRow: { sticky: 5, normal: 4 },
  subHeader: { sticky: 3, normal: 2 },
  stickyColumn: 1,
} as const;

const joinShadows = (...shadows: (string | false)[]) =>
  shadows.filter(Boolean).join(', ') || undefined;

/** 量測元素高度，並在尺寸改變時更新。 */
const useElementHeight = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setHeight(el.offsetHeight);
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, height] as const;
};

type RowGroupProps<TRow extends { id: string }> = {
  row: TRow;
  columns: DisplayColumn<TRow>[];
  isExpanded: boolean;
  isLastRow: boolean;
  stickyTopOffset: string;
  headerHeight: number;
  scrollRootRef: React.RefObject<HTMLDivElement | null>;
  renderSubContent?: StickyTableProps<TRow>['renderSubContent'];
};

const RowGroup = <TRow extends { id: string }>({
  row,
  columns,
  isExpanded,
  isLastRow,
  stickyTopOffset,
  headerHeight,
  scrollRootRef,
  renderSubContent,
}: RowGroupProps<TRow>): React.ReactNode => {
  const [rowRef, rowHeight] = useElementHeight<HTMLTableRowElement>();
  const subRowRef = useRef<HTMLTableRowElement>(null);

  // td 的 sticky 範圍是整個 table（不受 tbody 限制），子內容捲過去後父列會一直黏在頂部、與其他列疊在一起。
  // 因此捲動時計算子內容底部是否已進入父列範圍，用負的 --row-push 把父列跟著往上推（直接改 style，不觸發 re-render）。
  useEffect(() => {
    const row = rowRef.current;
    const subRow = subRowRef.current;
    const root = scrollRootRef.current;
    if (!isExpanded || !row || !subRow || !root) return;

    let frameId = 0;
    const updatePush = () => {
      frameId = 0;
      const subContentBottom =
        subRow.getBoundingClientRect().bottom - root.getBoundingClientRect().top;
      const push = Math.min(0, subContentBottom - headerHeight - rowHeight);
      row.style.setProperty('--row-push', `${push}px`);
    };
    const onScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(updatePush);
    };

    updatePush();
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      root.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameId);
      row.style.removeProperty('--row-push');
    };
  }, [isExpanded, headerHeight, rowHeight, rowRef, scrollRootRef]);

  const rowStickyTop = `calc(${stickyTopOffset} + ${headerHeight}px)`;

  return (
    <tbody>
      <tr ref={rowRef}>
        {columns.map((column) => (
          <td
            key={column.key}
            // 垂直 sticky：只有展開中的列需要，整行每個 td 都 sticky（瀏覽器不支援在 tr 上設定 sticky）
            className={cn(
              'border-b border-outline-2 bg-surface-1 px-md py-sm',
              (isExpanded || column.isSticky) && 'sticky',
            )}
            style={{
              top: isExpanded ? `calc(${rowStickyTop} + var(--row-push, 0px))` : undefined,
              left: column.leftOffset,
              zIndex: isExpanded
                ? column.isSticky
                  ? Z_INDEX.stuckRow.sticky
                  : Z_INDEX.stuckRow.normal
                : column.isSticky
                  ? Z_INDEX.stickyColumn
                  : undefined,
              width: column.width,
              minWidth: column.width,
              boxShadow: joinShadows(
                !!column.isSticky && STICKY_COLUMN_SHADOW,
                isExpanded && STICKY_ROW_SHADOW,
              ),
            }}
          >
            {column.skipOverflow ? (
              column.render(row)
            ) : (
              <div className="truncate">{column.render(row)}</div>
            )}
          </td>
        ))}
      </tr>
      {/* 不使用 collapse 動畫，因為 overflow:hidden 會破壞子表格的 sticky 定位 */}
      {renderSubContent && isExpanded && (
        <tr ref={subRowRef}>
          <td colSpan={columns.length} className="bg-gray-100 p-0">
            <div className="border-b border-outline-2 p-lg">
              {renderSubContent(row, {
                stickyTopOffset: `calc(${rowStickyTop} + ${rowHeight}px)`,
              })}
            </div>
          </td>
        </tr>
      )}
      {/* 每一列的間格 */}
      {!isLastRow && <tr className="h-sm" />}
    </tbody>
  );
};

const StickyTable = <TRow extends { id: string }>({
  rows,
  columns,
  renderSubContent,
  isSubTable = false,
  stickyTopOffset = '0px',
}: StickyTableProps<TRow>): React.ReactNode => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [theadRef, headerHeight] = useElementHeight<HTMLTableSectionElement>();
  const scrollRootRef = useRef<HTMLDivElement>(null);

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const hasSubContent = !!renderSubContent;

  // 展開/收合欄位：不套用 overflow:hidden，避免按鈕被裁切
  const expandToggleColumn: StickyTableColumn<TRow> & { skipOverflow: true } = {
    key: '__expand-toggle',
    header: '',
    width: '48px',
    isSticky: true,
    skipOverflow: true,
    render: (row) => (
      <ExpandToggleButton isOpen={expandedRows.has(row.id)} onClick={() => toggleRow(row.id)} />
    ),
  };

  const displayColumns = hasSubContent ? [expandToggleColumn, ...columns] : columns;

  // 計算每個 sticky column 的 left 偏移量
  let currentLeft = 0;
  const columnsWithOffset: DisplayColumn<TRow>[] = displayColumns.map((col) => {
    const skipOverflow = 'skipOverflow' in col && col.skipOverflow === true;
    if (col.isSticky) {
      const offset = currentLeft;
      currentLeft += parseInt(col.width, 10) || 0;
      return { ...col, leftOffset: `${offset}px`, skipOverflow };
    }
    return { ...col, leftOffset: undefined, skipOverflow };
  });

  const headerZIndex = isSubTable ? Z_INDEX.subHeader : Z_INDEX.header;

  const tableContent = (
    <table
      className={cn(
        'table-fixed border-separate border-spacing-0 text-sm',
        !isSubTable && 'min-w-[980px]',
      )}
    >
      <thead ref={theadRef}>
        <tr>
          {columnsWithOffset.map((column) => (
            <th
              key={column.key}
              className="sticky bg-steel-50 px-md py-sm text-left text-xs font-bold uppercase tracking-wide text-gray-700"
              style={{
                top: stickyTopOffset,
                left: column.leftOffset,
                zIndex: column.isSticky ? headerZIndex.sticky : headerZIndex.normal,
                width: column.width,
                minWidth: column.width,
                boxShadow: joinShadows(column.isSticky && STICKY_COLUMN_SHADOW, HEADER_SHADOW),
              }}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      {rows.map((row, rowIdx) => (
        <RowGroup
          key={row.id}
          row={row}
          columns={columnsWithOffset}
          isExpanded={expandedRows.has(row.id)}
          isLastRow={rowIdx === rows.length - 1}
          stickyTopOffset={stickyTopOffset}
          headerHeight={headerHeight}
          scrollRootRef={scrollRootRef}
          renderSubContent={renderSubContent}
        />
      ))}
    </table>
  );

  // 子表格不建立獨立的滾動容器，直接繼承父層的 scroll context
  if (isSubTable) return tableContent;

  return (
    <div
      ref={scrollRootRef}
      className="max-h-[520px] overflow-auto rounded-md border border-outline-2 bg-surface-1"
    >
      {tableContent}
    </div>
  );
};

export default StickyTable;
