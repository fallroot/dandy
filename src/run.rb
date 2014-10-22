# encoding: utf-8

require 'net/http'
require 'uri'

# 기본 경로 설정
home_dir = File.expand_path '~/.dandy'

# 선택 문장 가져오기
query_file = File.join home_dir, 'query.txt'
query = File.read query_file

# 임시로 사용한 선택 문장을 담은 파일 삭제
File.delete query_file

# 부산대 맞춤법/문법 검사기 접속
uri = URI.parse 'http://164.125.36.75/PnuSpellerISAPI_201107/lib/PnuSpellerISAPI_201107.dll?Check'

http = Net::HTTP.new uri.host, uri.port

request = Net::HTTP::Post.new uri.request_uri
request.set_form_data 'text1' => query

begin
    response = http.request request
    html = response.body.force_encoding("utf-8")
    # 필요한 데이터만 뽑아 내기
    if html =~ /\s*<form id='formBugReport'[^>]+>(.*?)<\/form>/im
        source = $1
    elsif html =~ /문법 및 철자 오류가 발견되지 않았습니다./im
        source = "문법 및 철자 오류가 발견되지 않았습니다."
    else
        source = "HTML 분석에 실패했습니다."
    end
rescue => e
    source = e
end

# 템플릿 파일 읽기
template_file = File.join home_dir, 'template.html'
template = File.read template_file

# 템플릿 채우기
template.gsub! '{{source}}', source

# 최종 결과 파일에 쓰기
output_file = File.join home_dir, 'output.html'
File.open(output_file, 'w') do |file|
    file.write template
end
