import bcrypt from 'bcrypt';

const saltRounds = 12;

export async function hashPassword(password: string) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw new Error('비밀번호 해싱에 실패했습니다');
  }
}

export async function comparePassword(
  inputPassword: string,
  hashedPassword: string,
) {
  try {
    const result = await bcrypt.compare(inputPassword, hashedPassword);
    return result;
  } catch (error) {
    throw new Error('비밀번호 비교에 실패했습니다');
  }
}
