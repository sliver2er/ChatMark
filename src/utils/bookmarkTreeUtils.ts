import { BookmarkItem } from "../types";

/**
 * 루트 북마크만 필터링 (parent_bookmark가 null인 북마크)
 */
export function getRootBookmarks(bookmarks: BookmarkItem[]): BookmarkItem[] {
  return bookmarks.filter((bookmark) => bookmark.parent_bookmark === null);
}

/**
 * 특정 부모 ID를 가진 자식 북마크 찾기
 */
export function getChildBookmarks(
  bookmarks: BookmarkItem[],
  parentId: string
): BookmarkItem[] {
  return bookmarks.filter((bookmark) => bookmark.parent_bookmark === parentId);
}

/**
 * 북마크를 created_at 기준으로 정렬
 */
export function sortBookmarksByDate(bookmarks: BookmarkItem[]): BookmarkItem[] {
  return [...bookmarks].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

/**
 * 북마크를 order 기준으로 정렬
 */
export function sortBookmarksByOrder(bookmarks: BookmarkItem[]): BookmarkItem[] {
  return [...bookmarks].sort((a, b) => a.order - b.order);
}

/**
 * 특정 부모 북마크의 모든 자손 ID를 재귀적으로 가져오기
 * (폴더 삭제 시 cascade 삭제에 사용)
 */
export function getAllDescendantIds(
  bookmarks: BookmarkItem[],
  parentId: string
): string[] {
  const children = getChildBookmarks(bookmarks, parentId);
  const descendantIds: string[] = [];

  for (const child of children) {
    descendantIds.push(child.id);
    descendantIds.push(...getAllDescendantIds(bookmarks, child.id));
  }

  return descendantIds;
}

/**
 * 북마크가 자식을 가지고 있는지 확인 (폴더인지 확인)
 */
export function hasChildren(
  bookmarks: BookmarkItem[],
  bookmarkId: string
): boolean {
  return bookmarks.some((bookmark) => bookmark.parent_bookmark === bookmarkId);
}

/**
 * 고아 북마크 찾기 (parent_bookmark가 존재하지 않는 ID를 참조)
 */
export function findOrphanedBookmarks(bookmarks: BookmarkItem[]): BookmarkItem[] {
  const allIds = new Set(bookmarks.map((b) => b.id));

  return bookmarks.filter((bookmark) => {
    if (!bookmark.parent_bookmark) return false;
    return !allIds.has(bookmark.parent_bookmark);
  });
}

/**
 * 순환 참조 확인 (북마크 A의 부모로 A의 자손을 설정하려는 경우)
 */
export function wouldCreateCycle(
  bookmarks: BookmarkItem[],
  bookmarkId: string,
  newParentId: string
): boolean {
  // bookmarkId가 newParentId의 조상인지 확인
  const descendantIds = getAllDescendantIds(bookmarks, bookmarkId);
  return descendantIds.includes(newParentId);
}
