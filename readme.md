# 단디

“단디”는 부산대학교 인공지능연구실과 (주)나라인포테크가 공동으로 만들어 http://speller.cs.pusan.ac.kr 페이지에서 제공하는 “한국어 맞춤법/문법 검사기”를 맥에서 쉽게 사용할 수 있도록 해 주는 도구입니다. 맥의 오토메이터를 이용해서 맥 서비스 형태로 제작했습니다.

## 설치

터미널에서 아래 명령어를 입력합니다.

```sh
curl https://raw.githubusercontent.com/fallroot/dandy/master/bin/install.sh | sh
```

## 삭제

터미널에서 아래 명령어를 입력합니다.

```sh
curl https://raw.githubusercontent.com/fallroot/dandy/master/bin/uninstall.sh | sh
```

## 사용법

1. 맞춤법 검사를 할 문장을 선택합니다.
2. **서비스 > 한국어 맞춤법 검사**를 실행합니다. 또는 등록한 단축키를 누릅니다.

### 단축키 등록

1. **시스템 환경설정 > 키보드 > 키보드 단축키** 탭을 엽니다.
2. 왼쪽 목록에서 **서비스**를 선택합니다.
3. **한국어 맞춤법 검사**를 선택하고 원하는 단축키를 등록합니다.

## 사용자 설정

팝업 창의 크기나 CSS가 맘에 들지 않을 경우

- `~/Library/Services/dandy.workflow` 파일을 오토메이터에서 열어 수정합니다.
- `~/.dandy` 디렉토리에 있는 파일을 수정합니다.

## 기타

### 주의 사항

제공자의 정책에 따라 서비스를 중단할 수도 있습니다.

### 아이콘

[Gemicon](http://gemicon.net/)에서 제공하는 아이콘을 사용했습니다.
