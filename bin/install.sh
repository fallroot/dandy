#!/bin/sh

# “단디” 설치 스크립트입니다.
#
# 전체 코드는 아래 저장소에 있습니다.
# https://github.com/fallroot/dandy
#
# 설치
# curl https://raw.github.com/fallroot/dandy/develop/bin/install.sh | sh
#
# 삭제
# curl https://raw.github.com/fallroot/dandy/develop/bin/uninstall.sh | sh

echo "한국어 맞춤법/문법 검사기 도우미 “단디”를 설치합니다."

echo "홈 디렉토리 아래 .dandy 디렉토리를 만듭니다."
mkdir -p ~/.dandy

echo "실행 파일을 내려받습니다."
for file in dandy.css dandy.js config.png run.rb finish.rb config template; do
    curl https://raw.github.com/fallroot/dandy/develop/src/$file -o ~/.dandy/$file
done

echo "워크플로우 파일을 설치합니다."

# 압축한 워크플로우 파일을 해제하여 서비스 디렉토리에 옮긴다.
curl https://raw.github.com/fallroot/dandy/develop/build/dandy.zip -o ~/.dandy/dandy.zip
rm -f ~/Library/Services/._dandy.workflow
unzip -o ~/.dandy/dandy.zip -d ~/Library/Services
rm -f ~/.dandy/dandy.zip

# 서비스 메뉴에 보이도록 활성화한다.
/System/Library/CoreServices/pbs -flush

echo "단디 설치가 끝났습니다."
