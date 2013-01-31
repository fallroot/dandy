#!/bin/sh

# “단디” 설치 스크립트입니다.
#
# 전체 코드는 아래 저장소에 있습니다.
# https://github.com/fallroot/dandy
#
# 설치
# curl https://raw.github.com/fallroot/dandy/bin/install.sh | sh
#
# 삭제
# curl https://raw.github.com/fallroot/dandy/bin/uninstall.sh | sh

echo "한국어 맞춤법/문법 검사기 도우 “단디”를 설치합니다."

echo "홈 디렉토리 아래 .dandy 디렉토리를 만듭니다."
mkdir -p ~/.dandy

for file in default.css default.js error.png passed.png run.rb template.html; do
    echo "$file을 내려받고 있습니다."
    curl https://raw.github.com/fallroot/dandy/master/src/$file -o ~/.dandy/$file
done

echo "단디 설치가 끝났습니다."