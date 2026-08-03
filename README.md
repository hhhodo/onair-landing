# ONAIR — media landing page

미디어/콘텐츠 제작 브랜드 "ONAIR" 한 페이지 랜딩. 콘텐츠(카피/브랜드명/통계)는 미디어 산업으로
새로 작성했고, 타이포/컬러/그리드/여백은 Figma 레퍼런스(`BrVaTxFSnaAlv6IT2ZRvhs`, node
`31:10700`)에서 실측한 값을 그대로 사용했다.

## 레퍼런스 취득 경로 (1차 실수 → 2차 정정)

1차 시도에서 최상위 node `31:10700`에 대한 `get_design_context` 호출이 sparse geometry(좌표만,
폰트/색상/여백 없음) 응답만 반환했는데, 이를 인지하지 못하고 스크린샷만 보고 타이포/컬러/그리드
값을 추측해서 빌드했다. 사용자가 "폰트두께 크기 그리드 여백 싹 다르다"고 지적한 뒤, 섹션별
sub-node(`31:12177` 배너, `31:11922` 히어로 타이틀, `32:17295` Latest, `33:17889` Stats,
`32:13716` Services, `32:14560` 콜라주, `33:18062` 클로저)에 개별적으로 `get_design_context`를
재호출해 실제 Tailwind 리터럴 값(font-size, letter-spacing, line-height, color, padding)을
확보하고 전면 재작성했다. `get_variable_defs`는 빈 객체(`{}`)를 반환 — 이 파일은 Figma
Variable을 쓰지 않고 전부 리터럴 값이라, 아래 수치들은 전부 리터럴 실측치다.

## 실측값 대비 1차 빌드의 오차 (정정 내역)

| 항목 | 1차(추측) | 실측(Figma) |
|---|---|---|
| 배경색 | `--color-primary-900` (#262628, 짙은 회색) | 순수 `#000` |
| 히어로 헤드라인 | `--fs-h0`(64px), fw 700 | **140px**, fw 400(Regular만 존재, 볼드 없음) |
| LATEST 헤딩 | `--fs-h1`(56px) | **64px**, letter-spacing `-2.56px` |
| Stats 헤딩 | `--fs-h1`(56px) | **120px** |
| Services H1 | 기본 h2 | **96px**, letter-spacing `-1.92px` |
| 아코디언 타이틀 | `--fs-h2`(40px) | **64px**, letter-spacing `-1.28px` |
| 클로저 헤딩 | `--fs-h0`(64px) | **120px** |
| 컨테이너 | `.container`(1440px, 80px 거터) | 1920 풀블리드 캔버스, 섹션별 고정 padding **40px**(대부분)/**50px**(nav)/**60px**(stats) |
| 텍스트 컬러 | `text-subtle-inverse` 토큰 | `rgba(255,255,255,.8/.6/.4/.3/.13)` — 섹션마다 다른 리터럴 opacity |

## Variant Memo

```
typo=loud
image=medium
color=mono
image-radius=sharp
card-radius=sharp
button-radius=round
border=hairline
button-style=outline
fw=400 (Pretendard:Regular만 사용 — 볼드 웨이트 자체가 원본에 없음)
spacing=measured (styles.css space-* 토큰이 아니라 섹션별 실측 px)
```

## Layout Declaration & 그리드 근거 (실측)

| 섹션 | 분할 | 실측 근거 |
|---|---|---|
| Nav | full-bleed, `px-50` | 66px 고정 높이 |
| Hero | full-bleed, `px-40` | 헤드라인 140px/-1.4px/126px lh |
| Latest | 4-4-4 × 2행 | 원본 579×772 카드 6장, 가로 캐러셀(overflow) → 치트시트 하드룰(캐러셀 금지)로 3열×2행 정적 그리드로 전환. 카드 비율 579:772 실측 유지, gap은 원본에 없어 design-kit `--grid-gutter-lg`(24px) 사용 |
| Stats intro | 5-7 | 좌 800px : 우 492px (1800px 컨텐츠 기준), `px-60` 컨테이너 |
| Stats grid | 4-4-4-4 × 2행 | 450×289px 셀, `padding:48px`, 디바이더 `rgba(255,255,255,.3)` 1px 헤어라인만(갭 없음) |
| Services | full-bleed list, 확장 항목 6-6 | 96px H1, 아코디언 행 `border-bottom:#3d3d3d`. 실제 원본은 +/− 토글 아코디언이지만 치트시트 하드룰(아코디언 금지) + "문의하기 외 버튼 전부 삭제" 지시로 토글 버튼 기능 제거, 정적 리스트로 전환(첫 항목만 시각적으로 펼침) |
| Collage | full-bleed | 원본은 24장 15° 간격 원형 스캐터 — 재현 복잡도 대비 12장 30° 간격으로 단순화(각도 절반, 반지름 480px 고정) |
| Closer | 8-4 | 헤드라인 max-width 1073px(≈58%), CTA 280×280 원형 버튼 우측 고정 |

## 사용자 지시 반영

- 버튼은 "문의하기" 하나만 남기고 전부 제거(네비 CTA, view-all 링크, 아코디언 +/− 토글 기능,
  화살표 CTA, 소셜 아이콘 버튼 모두 삭제 — 남은 텍스트 링크는 네비/푸터 내비게이션이라 버튼이
  아님).
- 이미지 영역은 전부 `#d9d9d9` 플레이스홀더(`--img-fill`, 사용자가 직접 지정한 hex라 토큰 예외
  처리).
- 브랜드명 영어(ONAIR), 본문 카피 전부 한글.
- 통계/서비스/작업 카피는 미디어 제작사 콘텐츠로 새로 작성(레퍼런스 원문은 부동산 회사).

## 배포

GitHub Pages, `hhhodo/onair-landing` 레포, `.github/workflows/deploy.yml`
(`actions/upload-pages-artifact` + `actions/deploy-pages`)로 자동 배포.
