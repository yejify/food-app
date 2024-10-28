import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// GET과 POST 요청 핸들러 각각 명시
export { handler as GET, handler as POST };
