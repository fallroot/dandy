#!/bin/sh

# “단디” 삭제 스크립트입니다.
#
# 전체 코드는 아래 저장소에 있습니다.
# https://github.com/fallroot/dandy
#
# 설치
# curl https://raw.githubusercontent.com/fallroot/dandy/master/bin/install.sh | sh
#
# 삭제
# curl https://raw.githubusercontent.com/fallroot/dandy/master/bin/uninstall.sh | sh

echo "한국어 맞춤법/문법 검사기 도우 “단디”를 삭제합니다."

echo "홈 디렉토리 아래 .dandy 디렉토리를 삭제합니다."
rm -rf ~/.dandy/

echo "실행 파일을 삭제합니다."
rm -rf ~/Library/Services/dandy.workflow

# 서비스 메뉴에서 삭제한다.
/System/Library/CoreServices/pbs -flush

echo "단디 삭제가 끝났습니다."
