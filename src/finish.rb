require 'json'

# 기본 경로 설정
home_dir = File.expand_path '~/.dandy'

# 결과 파일 읽어 오기
result_file = File.join home_dir, 'result'
result = JSON.parse File.read result_file

# 환경 설정 파일
if result.key? 'config'
    config_file = File.join home_dir, 'config'

    File.open(config_file, 'w') do |file|
        file.write result['config'].to_json
    end
end

# 선택 문장 가져오기
query_file = File.join home_dir, 'query'

# 대치어로 바꾸기
answers = result['answers']

unless answers.empty?
    query = File.read query_file

    answers.each do |key, value|
        query.gsub!(key) {value}
    end
end

# 사용한 파일 삭제
File.delete query_file
File.delete result_file

puts query unless answers.empty?
