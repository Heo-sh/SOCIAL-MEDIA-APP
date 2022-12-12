# SERVER

# MERN Stack
M (MongoDB) : 데이터베이스(DataBase).
E (Express) : 서버 프레임워크(ServerFramework).
R (React) : 프론트엔드 프레임워크(FrontendFramework).
N (NodeJS) : 서버 개발언어(Server DevelopmentLanguage)

# 파일과 디렉토리(File with Directory)
- index.js.
Entry point (app의 시작점)
- package.json.
App's informations (app의 정보들).
-m.env (enviroment variables).
환경변수(app에 전체적으로 사용되는 변수)를 저장하는 파일
- routes/.
라우트 처리를 하는 파일들을 보관한다.
라우트: 요청받은 url을 컨트롤러(로직처리)에 연결하는 역할을 한다.
- Controllers/.
컨트롤러(로직처리).
Ex 클라이언트로부터 받은 데이터 처리, 데이터베이스에 쿼리 전송 등
- models.
데이터베이스 구조를 정의한다.
- Auth.
인증을 관리한다.
- Data.
유저가 업로드한 파일을 보관한다.
Ex. 프로필 사진, 포스트 이미지
