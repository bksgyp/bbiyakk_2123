import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const providerId = account.providerAccountId;
      const provider = account.provider;

      // 사용자 정보가 데이터베이스에 있는지 확인
      let existingUser = await prisma.user.findFirst({
        where: {
          providerId: providerId,
          provider: provider,
        },
      });

      console.log("조회함");

      // 사용자가 없으면 데이터베이스에 추가
      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            providerId: providerId,
            provider: provider,
            username: user.name,
            mode: 0
          },
        });
      }

      return {
        id: existingUser.id,
        username: existingUser.username,
        providerId: existingUser.providerId,
        provider: existingUser.provider,
        major: existingUser.major,
        college: existingUser.college,
        mode: existingUser.mode,
      }
    },
    async jwt({ token, user, trigger, session }) {
        console.log("chk",token,user)
      // 로그인 시 사용자 정보를 토큰에 추가
      if (user) {
        // 데이터베이스에서 사용자 정보 조회
        const dbUser = await prisma.user.findFirst({
          where: {
            providerId: user.id.toString(), // 소셜 로그인의 ID를 providerId로 사용
          },
        });

        if (dbUser) {
          // 데이터베이스에서 가져온 모든 정보를 토큰에 저장
          token.id = dbUser.id;
          token.providerId = dbUser.providerId;
          token.provider = dbUser.provider;
          token.username = dbUser.username,
          token.major = dbUser.major;
          token.college = dbUser.college;
          token.mode = dbUser.mode;
          // 데이터베이스에 있는 다른 필드들도 추가
        }
      }
      console.log("trigger",trigger)
      if(trigger === "update" && session?.user?.major){
        token.major = session.user.major;
        token.college = session.user.college;
        token.mode = session.user.mode;
      }
      if(trigger === "update" && session?.mode !== undefined) {
        token.mode = session.mode;
        console.log("JWT updated with new mode:", token.mode);
      }
      return token;
    },
    async session({ session, token }) {
      console.log("session",session,token);
      // 세션에 토큰 정보를 추가
      session.user.id = token.id;
      session.user.providerId = token.providerId;
      session.user.provider = token.provider;
      session.user.username = token.username;
      session.user.major = token.major;
      session.user.college = token.college;
      session.user.mode = token.mode;
      // 필요한 다른 필드 추가
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
