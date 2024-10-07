//https로 할경우 package json 수정
"dev": "next dev -H (IP입력) -p (PORT번호) --experimental-https",
예시 -> "dev": "next dev -H 192.168.35.80 -p 3005 --experimental-https",

- env파일도 프로토콜을 https로 변경
- mkcert로 인증 파일 생성해야함.

https://worldkorea.vercel.app/
