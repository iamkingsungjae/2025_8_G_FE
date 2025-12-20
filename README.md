# Panel Insight Frontend

![와쏘베쏘 (1)](https://github.com/user-attachments/assets/418c36e9-7f78-484e-add6-4c2af297c9fc)


Panel Insight은 패널 데이터 분석 및 클러스터링을 위한 웹 애플리케이션입니다.

## Preview
<img width="1152" height="624" alt="패널인사이트" src="https://github.com/user-attachments/assets/758fcc30-4a6f-4612-aebc-1835bcb5b857" />
<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/f0db4b7f-c47e-499f-982c-c8bd51325c93" width="500"/>
      <div style="font-size:12px;">패널 검색 결과 화면</div>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/fc2bea71-7e88-4c2d-b70c-9e377b54f837" width="500"/>
      <div style="font-size:12px;">패널 상세 정보 및 인사이트</div>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/d449dd77-7991-434d-8c3b-5e78c98c6ff8" width="500"/>
      <div style="font-size:12px;">클러스터링 UMAP 시각화 화면</div>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/b74b8ebd-f018-4bf8-800e-11e8c62e969c" width="500"/>
      <div style="font-size:12px;">클러스터 비교 분석 화면</div>
    </td>
  </tr>
</table>



## Member
<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/iamkingsungjae">
          <img src="https://avatars.githubusercontent.com/u/143139013?v=4" width="150px;" alt=""/><br />
          <sub><b> 유성재 </b></sub>
        </a><br />
      </td>
      <td align="center">
        <a href="https://github.com/Jongyukim">
          <img src="https://avatars.githubusercontent.com/u/139373126?v=4" width="150px;" alt=""/><br />
          <sub><b> 김종유 </b></sub>
        </a><br />
      </td>
      <td align="center">
        <a href="https://github.com/MJW207">
          <img src="https://avatars.githubusercontent.com/u/139373162?v=4" width="150px;" alt=""/><br />
          <sub><b> 문재원 </b></sub>
        </a><br />
      </td>
      <td align="center">
        <a href="https://github.com/Minsu0318">
          <img src="https://avatars.githubusercontent.com/u/143139139?v=4" width="150px;" alt=""/><br />
          <sub><b> 김민수 </b></sub>
        </a><br />
      </td>
    </tr>
    <tr>
      <td align="center">Lead / AI / Data</td>
      <td align="center">FE / BE</td>
      <td align="center">BE / AI</td>
      <td align="center"> Data </td>
    </tr>
  </tbody>
</table>

## Tech Stack

- **React 18.3.1** - UI 라이브러리
- **TypeScript 5.9.3** - 타입 안정성
- **Vite 6.3.5** - 빌드 도구
- **Radix UI** - 접근성 기반 UI 컴포넌트
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **Recharts** - 차트 라이브러리
- **Sonner** - 토스트 알림

## Getting Started

### Installation

```bash
git clone https://github.com/hansung-sw-capstone-2025-2/2025_8_G_FE.git
cd 2025_8_G_FE
```

```bash
npm install
```

### Development

```bash
npm run dev
```

기본 포트는 5173입니다. 다른 포트로 실행하려면:

```bash
npm run dev:3001  # 포트 3001
npm run dev:3002  # 포트 3002
```

### Build

```bash
npm run build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

### Preview Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/                    # API 클라이언트 (lib/utils.ts)
├── components/             # 페이지 컴포넌트
│   ├── drawers/           # 드로어 컴포넌트
│   │   ├── FilterDrawer.tsx
│   │   ├── PanelDetailDrawer.tsx
│   │   ├── ClusterDetailDrawer.tsx
│   │   ├── SummaryStatDrawer.tsx
│   │   └── ExportDrawer.tsx
│   ├── pages/             # 메인 페이지들
│   │   ├── StartPage.tsx
│   │   ├── ResultsPage.tsx
│   │   ├── ClusterLabPage.tsx
│   │   └── ComparePage.tsx
│   └── charts/            # 차트 컴포넌트
├── lib/                   # 유틸리티 및 헬퍼 함수
│   ├── utils.ts           # API 유틸리티
│   ├── config.ts          # 설정 (API URL 등)
│   ├── history.ts         # 히스토리 관리
│   ├── bookmarkManager.ts # 북마크 관리
│   ├── presetManager.ts   # 프리셋 관리
│   └── DarkModeSystem.tsx # 다크 모드 시스템
├── types/                  # TypeScript 타입 정의
├── ui/                     # UI 컴포넌트 라이브러리
│   ├── base/              # 기본 UI 컴포넌트 (Radix UI 기반)
│   ├── pi/                 # Panel Insight 전용 컴포넌트
│   ├── profiling-ui-kit/   # 프로파일링 UI 컴포넌트
│   │   └── components/      # 비교 분석 컴포넌트
│   ├── summary/            # 요약 정보 컴포넌트
│   └── filter/             # 필터 컴포넌트
├── styles/                 # 전역 스타일시트
│   ├── tokens.css          # 디자인 토큰
│   └── globals.css         # 전역 스타일
└── utils/                  # 유틸리티 함수
```

## Key Features

- **패널 검색**: 텍스트 기반 패널 검색 및 필터링
- **군집 분석**: HDBSCAN 기반 클러스터링 및 UMAP 시각화
- **비교 분석**: 여러 군집 간 통계적 비교 분석
- **패널 상세 정보**: 패널별 상세 정보 및 응답 데이터 조회
- **데이터 내보내기**: CSV, JSON, TXT, PNG 형식으로 데이터 내보내기
- **프리셋 관리**: 검색 필터 프리셋 저장 및 관리
- **북마크**: 패널 북마크 기능
- **다크 모드**: 다크/라이트 모드 지원

## Environment Variables

`.env` 파일에 다음 변수를 설정하세요:

```env
VITE_API_URL=http://127.0.0.1:8004
```

## License

이 프로젝트는 한성대학교 기업연계 SW캡스톤디자인 수업에서 진행되었습니다.
