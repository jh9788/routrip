# routrip
![image](https://github.com/7days-routrip/routrip/assets/66871221/bd89a73f-8621-4a7d-940f-bbfa1a51939b)


## 프로젝 소개
자신만의 여행 일정을 계획하고 다른 사람들과 여행기를 공유할 수 있는 웹 서비스입니다.

## 주요 기능
- 유저기능
  ![image](https://github.com/7days-routrip/routrip/assets/66871221/12e1c456-0e3c-493f-bea5-eabbf9e49283)

- 사용자 정보 수정
  ![image](https://github.com/7days-routrip/routrip/assets/66871221/bcb25e60-eab0-4abd-995a-916b5563f2ff)

- 마이페이지
  ![image](https://github.com/7days-routrip/routrip/assets/66871221/5faa97f8-a070-4a44-baaf-afd5ec61998a)

- 일정
  ![image](https://github.com/7days-routrip/routrip/assets/66871221/da504533-eb91-4822-b172-2653e92cc04a)
  ![image](https://github.com/7days-routrip/routrip/assets/66871221/7a1b87ff-e9c9-44df-be42-075f92cd35ae)

- 게시판
  ![image](https://github.com/7days-routrip/routrip/assets/66871221/95fb29d8-9897-4482-8451-198cb03b31d8)

  ![image](https://github.com/7days-routrip/routrip/assets/66871221/89736b76-0bf1-4635-ac12-3c49a129db0b)

## 시작하기
이 지침은 개발 및 테스트 목적으로 로컬 머신에 프로젝트를 설정하고 실행하는 방법을 안내합니다. 프로젝트를 라이브 시스템에 배포하는 방법에 대한 설명은 배포 섹션을 참조하세요.

### 필수 사항
- env 파일 (backend)
  ```env
  DB_USER=
  DB_PASSWORD=
  DB_DATABASE=
  DB_HOST= 
  DB_PORT=
  DB_LIMIT=
  
  #CORS
  CORS_ORIGIN=
  
  WT =>
  JWT_ACCESS_SECRET=
  JWT_ACCESS_EXPIRED_IN=
  JWT_REFRESH_SECRET=
  JWT_REFRESH_EXPIRED_IN=
  
  
  #bcrypt
  SALT_ROUND=
  
  #aws
  ACCESS_KEY=
  SECRET_ACCESS_KEY=
  S3_BUCKET_REGION=
  S3_BUCKET_NAME=
  ```
- env 파일 (frontend)
  ```env
  VITE_BASE_URL= 
  VITE_GOOGLE_MAP_API_KEY=
  ```

### 설치
개발 환경을 실행하는 단계별 예시를 설명합니다.

다음과 같은 단계로 진행합니다.

```
npm i
```

#### server 실행

```
npm run start
```

#### client 실행

```
npm run dev
```

### 사용된 도구
- 언어 : TypeScript
- 빌드도구 : Vite
- 라이브러리 : ReactJs, Express
- CSS : Styled component
- 상태관리 : zustand, tanstack query
- DB :  MariaDB, TypeORM
- 배포 : AWS-EC2, ECR

### 아키텍쳐
![image](https://github.com/7days-routrip/routrip/assets/66871221/6292f74c-325b-42bc-b558-007eed246563)

### 팀 개발 일지 (notion)
https://hongii.notion.site/7-6d96f562bb87469ebeaaab397327f3f7?pvs=4

### 팀원소개
- 프론트엔드
  - 김홍래 :
  - 김홍은 :
  - 이철욱 :
- 백엔드
  - 하종훈 :
  - 황성택 :
  - 전다해 :
