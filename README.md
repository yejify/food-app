# Food-App

카카오 지도 API를 사용해 자신만의 맛집을 등록하고 관리할 수 있는 웹 사이트입니다. 다른 사람이 등록한 맛집도 좋아요 기능을 통해 마이페이지에서 관리할 수 있습니다. 댓글을 통해 유저간 소통이 가능하며 현재 위치를 중심으로 탐색이 가능한 서비스를 제공합니다.

[Food-App](https://food-app-lilac-seven.vercel.app/)

## 주요 기능

1. **Next.js 구조 이해 및 서버사이드 렌더링(SSR) 구현**

   - Next.js의 구조와 **SSR(Server-Side Rendering)** 개념을 이해하고, 이를 기반으로 프로젝트를 설계하였습니다.

2. **다양한 Data Fetching 방법과 라우팅**

   - Next.js의 **Data Fetching 메서드** (`getStaticProps`, `getServerSideProps`, `getStaticPaths` 등)와 **파일 기반 라우팅 시스템**을 활용하여 데이터 관리와 페이지 네비게이션을 효율적으로 구현하였습니다.

3. **Tailwind CSS를 활용한 스타일링**

   - **Tailwind CSS**를 통해 반응형 디자인과 빠른 스타일링을 적용하였습니다.

4. **API 설계 및 Prisma와 Supabase 연동**

   - **Next.js의 API Routes**를 활용하여 백엔드 API를 설계하고, **Prisma** 및 **Supabase**와의 연동을 통해 데이터베이스 CRUD 기능을 구현하였습니다.

5. **카카오 지도 API를 활용한 커스텀 마커 지도 앱**

   - **카카오 지도 API**를 사용하여 지도에 커스텀 마커를 표시하고, 위치 기반 기능을 구현하였습니다.

6. **Next-Auth를 이용한 사용자 인증**

   - **Next-Auth**를 사용하여 사용자 로그인/로그아웃 및 인증 상태 관리를 구현하였습니다.

7. **Vercel 배포 및 환경 변수 설정**
   - 프로젝트를 **Vercel**에 배포하고, **GitHub**와 연동하여 **자동 배포 파이프라인**을 구축하였습니다.
   - 배포 환경에서 **환경 변수**를 설정해 **구글, 카카오, 네이버 로그인** 기능을 연동하여 다양한 소셜 로그인을 구현하였습니다.

## 기술 스택

| **카테고리**              | **기술**                                   |
| ------------------------- | ------------------------------------------ |
| **프론트엔드 라이브러리** | React, React-DOM                           |
| **상태 관리**             | Zustand                                    |
| **API 통신**              | Axios                                      |
| **폼 관리**               | React Hook Form                            |
| **데이터 캐싱**           | TanStack React Query, React Query Devtools |
| **인증**                  | Next-Auth, @auth/prisma-adapter            |
| **아이콘**                | React Icons                                |
| **주소 검색**             | React Daum Postcode                        |
| **알림**                  | React Toastify                             |
| **스타일링**              | Tailwind CSS, Autoprefixer                 |
| **빌드 및 개발 도구**     | Next.js, TypeScript, ESLint, PostCSS       |
| **데이터베이스**          | Prisma, @prisma/client                     |
| **시드 데이터**           | ts-node                                    |

## 구현 페이지

구현 페이지 설명

## 트러블슈팅

1. recoil Next.js 버전 충돌
2. build 후 마커 안뜸
3. like POST api error
4. superbase 오류
