require 'net/http'
require 'uri'

# 기본 경로 설정
home_dir = File.expand_path '~/.dandy'

# 선택 문장 가져오기
query_file = File.join home_dir, 'query'
query = File.read query_file

# 부산대 맞춤법/문법 검사기 접속
uri = URI.parse 'http://speller.cs.pusan.ac.kr/PnuSpellerISAPI_201309/lib/PnuSpellerISAPI_201309.dll?Check'

http = Net::HTTP.new uri.host, uri.port

request = Net::HTTP::Post.new uri.request_uri
request.set_form_data 'text1' => query

begin
    response = http.request request

    # 필요한 데이터만 뽑아 내기
    if response.body =~ /\s*<form id='formBugReport1'[^>]+>(.*)<\/form>/im
        source = $1
    else
        source = "HTML 분석에 실패했습니다."
    end
rescue => e
    source = e
end

# 설정 파일 읽기
config_file = File.join home_dir, 'config'
config = File.read config_file

# 템플릿 파일 읽기
template_file = File.join home_dir, 'template'
template = File.read template_file

# 템플릿 채우기
template.gsub!('{{source}}') {source.force_encoding('utf-8')}
template.gsub!('{{config}}') {config.force_encoding('utf-8')}

# 최종 결과 파일에 쓰기
output_file = File.join home_dir, 'dandy.html'
File.open(output_file, 'w') do |file|
    file.write template
end
