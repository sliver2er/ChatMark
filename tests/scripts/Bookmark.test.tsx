import { injectBookmarkButton } from "@/scripts/injectBookmarkButton";

describe("Bookmark Button Injection", () => {
  test("텍스트 기반으로 ChatGPT 버튼을 찾아 북마크 버튼 삽입", () => {
    document.body.innerHTML = `
      <button class="dynamic-btn">
        <div>
          <span>
            <svg></svg>
            <span class="label">ChatGPT에게 묻기</span>
          </span>
        </div>
      </button>
    `;

    // 실행
    injectBookmarkButton();

    const askGPTBtn = document.querySelector(".dynamic-btn")!;
    const bookmarkBtn = document.querySelector("#bookmark-btn");

    // 존재 확인
    expect(bookmarkBtn).not.toBeNull();

    // 위치 확인
    expect(askGPTBtn.nextSibling).toBe(bookmarkBtn);
  });
});
