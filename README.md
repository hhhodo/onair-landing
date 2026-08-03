# ONAIR — media landing page

미디어/콘텐츠 제작 브랜드 "ONAIR" 한 페이지 랜딩. 디자인 레퍼런스는 Figma
(`BrVaTxFSnaAlv6IT2ZRvhs`, node `31:10700`)에서 `get_design_context`로 실측한 지오메트리를
그대로 따랐고, 콘텐츠(카피/브랜드명/통계)는 사용자 요청에 따라 미디어 산업으로 새로 작성했다.

## 레퍼런스 취득 경로

Figma MCP `get_design_context`가 node `31:10700`에 대해 좌표/텍스트만 담긴 sparse geometry
응답을 반환(색상·폰트·변수 없음)했다. 색상/타이포는 첨부 스크린샷(다크 테마, 화이트 텍스트, 레드
포인트 닷)을 기준으로 판단했고, 그리드 분할은 Figma 지오메트리 실측값을 그대로 사용했다.

## Variant Memo

```
typo=loud
image=medium
color=mono
image-radius=sharp
card-radius=sharp
button-radius=round
border=hairline
button-style=solid
fw=700/400
spacing=space-section
```

## Layout Declaration & 그리드 근거

| 섹션 | 분할 | Figma 실측 근거 |
|---|---|---|
| Nav | full-bleed | 66px 높이 고정 바 |
| Hero | full-bleed | 히어로 비주얼 1344×763.5, 헤드라인 풀블리드 |
| Latest (작업) | 4-4-4 × 2행 | 원본은 579×772 카드 6장이 가로 스크롤(캐러셀)이었으나, 치트시트 하드룰(캐러셀/페이지네이션 금지)에 따라 3열×2행 정적 그리드로 변경. 카드 비율 3:4(≈579:772)는 실측값 유지 |
| Stats intro | 5-7 | 좌측 카피 799.8 / 우측 배지 492 (1800 기준 비율 환산) |
| Stats grid | 3-3-3-3 × 2행 | 4열×2행, 450×289px 셀, 헤어라인 디바이더만 존재(갭 없음) — `.stat-grid` border로 재현 |
| Services | full-bleed 리스트, 확장 항목 6-6 | 920/920 균등 2열 (원본 아코디언의 +/− 토글은 하드룰상 아코디언 금지 + "문의하기 외 버튼 전부 삭제" 요청에 따라 제거하고 정적 리스트로 전환) |
| Collage | full-bleed | 원본은 24장 원형 스캐터였으나 지오메트리 재현 난이도 대비 실익이 낮아 6장 스태거드 로우로 단순화 (README에 명시) |
| Closer | 8-4 | 헤드라인 1072.75 / CTA 버튼 280×280 → 좌 2/3, 우 1/3 비율 |

## 사용자 지시 반영

- 버튼은 "문의하기" 하나만 남기고 전부 제거(네비 CTA, view all 링크, 아코디언 토글, 화살표 CTA,
  소셜 아이콘 버튼 모두 삭제).
- 이미지 영역은 전부 `#d9d9d9` 플레이스홀더(`--img-fill` 변수, 사용자가 직접 지정한 hex라 토큰
  예외로 처리).
- 브랜드명은 영어(ONAIR), 본문 카피는 전부 한글.
- 통계/서비스/작업 카피는 실제 미디어 제작사 콘텐츠로 새로 작성(레퍼런스는 부동산 회사 원문이었음).

## 배포

GitHub Pages, `hhhodo/onair-landing` 레포, `.github/workflows/deploy.yml`
(`actions/upload-pages-artifact` + `actions/deploy-pages`)로 자동 배포.
